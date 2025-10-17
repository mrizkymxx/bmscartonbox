

"use server";

import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";
import { Delivery, DeliveryItem, PurchaseOrder, ReadyToShipItem, OrderItem } from "../types";

// READ Deliveries
export async function getDeliveries(): Promise<Delivery[]> {
  try {
    const snapshot = await adminDb.collection("deliveries")
      .orderBy("deliveryDate", "desc")
      .get();

    if (snapshot.empty) {
      return [];
    }

    const deliveries: Delivery[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        deliveryNoteNumber: data.deliveryNoteNumber,
        customerName: data.customerName,
        customerId: data.customerId,
        deliveryDate: data.deliveryDate?.toDate?.()?.toISOString() || data.deliveryDate || new Date().toISOString(),
        items: data.items || [],
        expedition: data.expedition,
        vehicleNumber: data.vehicleNumber,
        driverName: data.driverName,
      };
    });

    return deliveries;
  } catch (error) {
    console.error("Error fetching deliveries: ", error);
    throw new Error("Failed to fetch deliveries from Firestore.");
  }
}

// READ Items that are ready to be shipped for a specific customer
export async function getReadyToShipItems(
  customerId: string,
  poId: string | null = null
): Promise<ReadyToShipItem[]> {
  if (!customerId) return [];

  try {
    let snapshot;
    if (poId) {
      // If a specific PO ID is provided, fetch only that PO
      const poDoc = await adminDb.collection("purchase_orders").doc(poId).get();
      if (!poDoc.exists || poDoc.data()?.customerId !== customerId) {
        return [];
      }
      snapshot = await adminDb.collection("purchase_orders").where("__name__", "==", poId).get();
    } else {
      // Otherwise, fetch all open POs for the customer
      snapshot = await adminDb.collection("purchase_orders")
        .where("customerId", "==", customerId)
        .where("status", "==", "Open")
        .get();
    }
    
    if (snapshot.empty) {
      return [];
    }

    const items: ReadyToShipItem[] = [];
    snapshot.docs.forEach((doc) => {
      const po = doc.data() as Omit<PurchaseOrder, "id" | "items"> & { items: OrderItem[] };
      if (po.items) {
        po.items.forEach((item: any) => {
          const delivered = item.delivered || 0;
          const produced = item.produced || 0;
          const availableToShip = produced - delivered;
          
          if (availableToShip > 0) {
            items.push({
              ...item,
              id: item.id,
              poId: doc.id,
              poNumber: po.poNumber,
              customerName: po.customerName,
              orderDate: (po.orderDate as any)?.toDate?.()?.toISOString() || po.orderDate || new Date().toISOString(),
              availableToShip: availableToShip,
            });
          }
        });
      }
    });

    return items;
  } catch (error) {
    console.error("Error fetching ready-to-ship items: ", error);
    throw new Error("Failed to fetch ready-to-ship items.");
  }
}

// CREATE Delivery Note and UPDATE related PO items
export async function createDelivery(data: Omit<Delivery, "id">) {
  try {
    // Use transaction for atomic operations
    await adminDb.runTransaction(async (transaction) => {
      // 1. Group items by their PO first
      const itemsByPo = data.items.reduce((acc, item) => {
        acc[item.poId] = acc[item.poId] || [];
        acc[item.poId].push(item);
        return acc;
      }, {} as Record<string, typeof data.items>);

      // 2. READ ALL PURCHASE ORDERS FIRST (Firebase requirement: all reads before writes)
      const poRefs: { [poId: string]: any } = {};
      const poData: { [poId: string]: PurchaseOrder } = {};
      
      for (const poId in itemsByPo) {
        const poRef = adminDb.collection("purchase_orders").doc(poId);
        poRefs[poId] = poRef;
        const poDoc = await transaction.get(poRef);
        if (!poDoc.exists) {
          throw new Error(`Purchase Order with ID ${poId} not found.`);
        }
        poData[poId] = poDoc.data() as PurchaseOrder;
      }

      // 3. NOW DO ALL WRITES - Create the new delivery note document
      const deliveryData = {
        ...data,
        deliveryDate: new Date(data.deliveryDate),
        // Clean up the items to only include what's needed for the delivery note
        items: data.items.map(item => ({
          poId: item.poId,
          orderItemId: item.orderItemId,
          name: item.name,
          poNumber: item.poNumber,
          quantity: item.quantity,
          type: item.type,
          finishedSize: item.finishedSize || null,
        })),
      };
      const deliveryRef = adminDb.collection("deliveries").doc();
      transaction.set(deliveryRef, deliveryData);

      // 4. Update each Purchase Order
      for (const poId in itemsByPo) {
        const updatedItems = [...poData[poId].items];
        let isPoCompleted = true;

        itemsByPo[poId].forEach((deliveryItem) => {
          const itemIndex = updatedItems.findIndex(
            (item) => item.id === deliveryItem.orderItemId
          );
          if (itemIndex > -1) {
            const item = updatedItems[itemIndex];
            item.delivered = (item.delivered || 0) + deliveryItem.quantity;
            
            if (item.delivered >= item.total) {
              item.status = 'Shipped';
            }
          }
        });
        
        for (const item of updatedItems) {
          if ((item.delivered || 0) < item.total) {
            isPoCompleted = false;
            break;
          }
        }

        transaction.update(poRefs[poId], { 
          items: updatedItems,
          status: isPoCompleted ? 'Completed' : 'Open' 
        });
      }
    });

    revalidatePath("/deliveries");
    revalidatePath("/production");
    revalidatePath("/purchase-orders");
    revalidatePath("/");
  } catch (error) {
    console.error("Error creating delivery: ", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create delivery note.");
  }
}


// DELETE
export async function deleteDelivery(id: string) {
  try {
    // Use transaction for atomic operations
    await adminDb.runTransaction(async (transaction) => {
      // 1. READ ALL DOCUMENTS FIRST (Firebase requirement: all reads before writes)
      const deliveryRef = adminDb.collection("deliveries").doc(id);
      const deliveryDoc = await transaction.get(deliveryRef);
      
      if (!deliveryDoc.exists) {
        throw new Error("Delivery Note not found.");
      }
      const deliveryData = deliveryDoc.data() as Delivery;

      const itemsByPo = deliveryData.items.reduce((acc, item) => {
        acc[item.poId] = acc[item.poId] || [];
        acc[item.poId].push(item);
        return acc;
      }, {} as Record<string, DeliveryItem[]>);

      // 2. Read all purchase order documents
      const poRefs: { [poId: string]: any } = {};
      const poData: { [poId: string]: PurchaseOrder } = {};
      
      for (const poId in itemsByPo) {
        const poRef = adminDb.collection("purchase_orders").doc(poId);
        poRefs[poId] = poRef;
        const poDoc = await transaction.get(poRef);
        if (!poDoc.exists) {
          console.warn(`Purchase Order with ID ${poId} not found during deletion. Skipping.`);
          continue;
        }
        poData[poId] = poDoc.data() as PurchaseOrder;
      }

      // 3. NOW DO ALL WRITES - Update purchase orders first
      for (const poId in itemsByPo) {
        if (!poData[poId]) continue; // Skip if PO wasn't found
        
        const updatedItems = [...poData[poId].items];

        itemsByPo[poId].forEach((deliveryItem) => {
          const itemIndex = updatedItems.findIndex(
            (item) => item.id === deliveryItem.orderItemId
          );

          if (itemIndex > -1) {
            const item = updatedItems[itemIndex];
            const originalDelivered = item.delivered || 0;
            item.delivered = originalDelivered - deliveryItem.quantity;
            if (item.delivered < 0) item.delivered = 0;

             if (item.status === 'Shipped' && item.delivered < item.total) {
                const produced = item.produced || 0;
                // If fully produced, it's ready to ship again. Otherwise it's 'In Production'
                item.status = produced >= item.total ? 'Ready to Ship' : 'In Production';
             }
          }
        });
        
        transaction.update(poRefs[poId], { 
          items: updatedItems,
          status: 'Open'
        });
      }

      // 4. Finally, delete the delivery document
      transaction.delete(deliveryRef);
    });

    revalidatePath("/deliveries");
    revalidatePath("/production");
    revalidatePath("/purchase-orders");
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting delivery: ", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete Delivery Note.");
  }
}

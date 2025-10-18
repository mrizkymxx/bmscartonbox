
"use server";

import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";
import { PurchaseOrder, ProductionItem, Customer, OrderItemStatus } from "../types";
import { COLLECTIONS } from "@/lib/constants";

// READ Production Items
export async function getProductionItems(): Promise<ProductionItem[]> {
  try {
    // Query all purchase orders using Firebase Admin SDK
    const snapshot = await adminDb.collection(COLLECTIONS.PURCHASE_ORDERS).get();

    if (snapshot.empty) {
      return [];
    }

    const productionItems: ProductionItem[] = [];
    snapshot.docs.forEach((doc) => {
      const poData = doc.data();
      const po = {
        ...poData,
        orderDate: poData.orderDate?.toDate?.()?.toISOString() || poData.orderDate || new Date().toISOString(),
      } as Omit<PurchaseOrder, "id">;
      
      if (po.items) {
        po.items.forEach((item: any) => {
          productionItems.push({
            ...item,
            poId: doc.id,
            poNumber: po.poNumber,
            customerName: po.customerName,
            orderDate: po.orderDate,
          });
        });
      }
    });

    // Sort items by order date, descending
    productionItems.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

    return productionItems;
  } catch (error) {
    console.error("Error fetching production items: ", error);
    throw new Error("Failed to fetch production items from Firestore.");
  }
}

// UPDATE Production Item Status and Quantity
export async function updateProductionItem(
  poId: string,
  itemId: string,
  newProduced: number,
  newStatus?: OrderItemStatus
) {
  try {
    const poRef = adminDb.collection(COLLECTIONS.PURCHASE_ORDERS).doc(poId);
    const poSnapshot = await poRef.get();

    if (!poSnapshot.exists) {
        throw new Error("Purchase Order not found.");
    }

    const poData = poSnapshot.data() as PurchaseOrder;
    const itemIndex = poData.items.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      throw new Error("Item not found in Purchase Order.");
    }
    
    const updatedItems = [...poData.items];
    const currentItem = updatedItems[itemIndex];

    currentItem.produced = newProduced;
    
    // Auto-update status based on production
    // This logic is now primarily visual on the frontend, but we keep a base status here.
    if (newStatus) {
       currentItem.status = newStatus;
    } else if (currentItem.produced >= currentItem.total) {
        currentItem.status = 'Ready to Ship';
    } else if (currentItem.produced > (currentItem.delivered || 0)) {
        currentItem.status = 'In Production';
    }

    await poRef.update({ items: updatedItems });

    // Revalidate paths to refresh data on relevant pages
    revalidatePath("/production");
    revalidatePath("/purchase-orders");
    revalidatePath("/");
  } catch (error) {
    console.error("Error updating production item: ", error);
    throw new Error("Failed to update production item.");
  }
}

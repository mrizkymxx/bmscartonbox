
"use server";

import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";
import { COLLECTIONS } from "@/lib/constants";
import { PurchaseOrder } from "../types";

// READ
export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  try {
    const snapshot = await adminDb.collection(COLLECTIONS.PURCHASE_ORDERS)
      .orderBy("orderDate", "desc")
      .get();
    
    if (snapshot.empty) {
      console.log("No purchase orders found.");
      return [];
    }

    const purchaseOrders: PurchaseOrder[] = snapshot.docs.map((doc) => {
       const data = doc.data();
       return {
         id: doc.id,
         poNumber: data.poNumber,
         customerName: data.customerName,
         customerId: data.customerId,
         orderDate: data.orderDate?.toDate?.()?.toISOString() || data.orderDate || new Date().toISOString(),
         status: data.status,
         items: data.items?.map((item: any) => ({ ...item, delivered: item.delivered || 0 })) || [], // Ensure items and delivered is always available
         pdfUrl: data.pdfUrl || "",
       }
    });

    return purchaseOrders;
  } catch (error) {
    console.error("Error fetching purchase orders: ", error);
    throw new Error("Failed to fetch purchase orders from Firestore.");
  }
}

// CREATE & UPDATE (Upsert)
export async function upsertPurchaseOrder(
  id: string | null,
  data: Omit<PurchaseOrder, "id">
) {
  try {
    const { orderDate, ...restData } = data;
    // Firestore expects a Date object for Timestamp fields
    const dataToSave: any = {
      ...restData,
      orderDate: orderDate ? new Date(orderDate) : new Date(),
    };

    if (id) {
      // Update existing PO
      await adminDb.collection(COLLECTIONS.PURCHASE_ORDERS).doc(id).update(dataToSave);
    } else {
      // Create new PO
      await adminDb.collection(COLLECTIONS.PURCHASE_ORDERS).add(dataToSave);
    }
    revalidatePath("/purchase-orders");
    revalidatePath("/"); // Also revalidate dashboard for recent POs
    revalidatePath("/production");
  } catch (error) {
    console.error("Error upserting purchase order: ", error);
    throw new Error("Failed to save purchase order data.");
  }
}

// DELETE
export async function deletePurchaseOrder(id: string) {
  try {
    await adminDb.collection(COLLECTIONS.PURCHASE_ORDERS).doc(id).delete();
    revalidatePath("/purchase-orders");
    revalidatePath("/");
    revalidatePath("/production");
  } catch (error) {
    console.error("Error deleting purchase order: ", error);
    throw new Error("Failed to delete purchase order.");
  }
}

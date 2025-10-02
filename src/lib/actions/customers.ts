"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { CustomerEntity, PaginatedResult, PaginationParams, Customer } from "@/lib/schemas";
import { DatabaseError, NotFoundError, ValidationError, handleError } from "@/lib/errors";
import { customerEntitySchema } from "@/lib/schemas";
import { COLLECTIONS } from "@/lib/constants";

const customersCollection = collection(db, COLLECTIONS.CUSTOMERS);

/**
 * Fetch all customers (for select dropdowns, etc.)
 */
export async function getAllCustomers(): Promise<CustomerEntity[]> {
  try {
    const snapshot = await getDocs(customersCollection);
    
    if (snapshot.empty) {
      return [];
    }

    const customers: CustomerEntity[] = snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      
      // Handle different date formats that might be in Firebase
      let registeredDate = new Date().toISOString();
      if (data.registered) {
        try {
          if (data.registered.toDate) {
            // Firestore Timestamp
            registeredDate = data.registered.toDate().toISOString();
          } else if (data.registered instanceof Date) {
            // JavaScript Date
            registeredDate = data.registered.toISOString();
          } else if (typeof data.registered === 'string') {
            // String date
            registeredDate = new Date(data.registered).toISOString();
          }
        } catch (dateError) {
          console.warn('Date conversion error for customer', docSnapshot.id, dateError);
        }
      }
      
      return {
        id: docSnapshot.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        registered: registeredDate,
      };
    });

    // Sort by registered date (newest first)
    customers.sort((a, b) => new Date(b.registered).getTime() - new Date(a.registered).getTime());

    return customers;
  } catch (error) {
    console.error("Error fetching all customers:", error);
    throw new DatabaseError("Failed to fetch customers");
  }
}

/**
 * Fetch customers with pagination and search
 */
export async function getCustomers(
  params: PaginationParams = {}
): Promise<PaginatedResult<CustomerEntity>> {
  try {
    const { page = 1, limit: pageLimit = 20, search, sortBy = "registered", sortOrder = "desc" } = params;
    
    let q = query(
      customersCollection,
      orderBy(sortBy, sortOrder),
      limit(pageLimit + 1) // Fetch one extra to check if there are more pages
    );

    // Add search filter if provided
    if (search) {
      q = query(q, where("name", ">=", search), where("name", "<=", search + "\uf8ff"));
    }

    // Handle pagination
    if (page > 1) {
      const prevPageQuery = query(
        customersCollection,
        orderBy(sortBy, sortOrder),
        limit((page - 1) * pageLimit)
      );
      const prevSnapshot = await getDocs(prevPageQuery);
      const lastDoc = prevSnapshot.docs[prevSnapshot.docs.length - 1];
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
    }

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;
    const hasNextPage = docs.length > pageLimit;
    const actualDocs = hasNextPage ? docs.slice(0, pageLimit) : docs;

    const customers: CustomerEntity[] = actualDocs.map((doc) => {
      const data = doc.data();
      
      // Handle different date formats that might be in Firebase
      let registeredDate = new Date().toISOString();
      if (data.registered) {
        if (data.registered.toDate) {
          // Firestore Timestamp
          registeredDate = data.registered.toDate().toISOString();
        } else if (data.registered instanceof Date) {
          // JavaScript Date
          registeredDate = data.registered.toISOString();
        } else if (typeof data.registered === 'string') {
          // String date
          registeredDate = new Date(data.registered).toISOString();
        }
      }
      
      return {
        id: doc.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        registered: registeredDate,
      };
    });

    // Get total count for pagination (this could be optimized with a separate counter)
    const totalSnapshot = await getDocs(collection(db, COLLECTIONS.CUSTOMERS));
    const total = totalSnapshot.size;

    return {
      data: customers,
      pagination: {
        page,
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit),
      },
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new DatabaseError("Failed to fetch customers");
  }
}

/**
 * Get customer by ID
 */
export async function getCustomerById(id: string): Promise<CustomerEntity> {
  try {
    if (!id) throw new ValidationError("Customer ID is required");

    const customerDoc = doc(db, COLLECTIONS.CUSTOMERS, id);
    const snapshot = await getDocs(query(collection(db, COLLECTIONS.CUSTOMERS), where("__name__", "==", id)));
    
    if (snapshot.empty) {
      throw new NotFoundError("Customer");
    }

    const data = snapshot.docs[0].data();
    
    // Handle different date formats that might be in Firebase
    let registeredDate = new Date().toISOString();
    if (data.registered) {
      if (data.registered.toDate) {
        // Firestore Timestamp
        registeredDate = data.registered.toDate().toISOString();
      } else if (data.registered instanceof Date) {
        // JavaScript Date
        registeredDate = data.registered.toISOString();
      } else if (typeof data.registered === 'string') {
        // String date
        registeredDate = new Date(data.registered).toISOString();
      }
    }
    
    return {
      id: snapshot.docs[0].id,
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      registered: registeredDate,
    };
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw handleError(error);
  }
}

/**
 * Create or update customer
 */
export async function upsertCustomer(
  id: string | null,
  data: Omit<Customer, "id" | "registered">
) {
  try {
    if (id) {
      // Update existing customer
      const customerDoc = doc(db, COLLECTIONS.CUSTOMERS, id);
      await updateDoc(customerDoc, data);
    } else {
      // Create new customer
      await addDoc(customersCollection, {
        ...data,
        registered: serverTimestamp(),
      });
    }
    revalidatePath("/customers");
  } catch (error) {
    console.error("Error upserting customer: ", error);
    throw new Error("Failed to save customer data.");
  }
}

// DELETE
export async function deleteCustomer(id: string) {
  try {
    const customerDoc = doc(db, "customers", id);
    await deleteDoc(customerDoc);
    revalidatePath("/customers");
  } catch (error) {
    console.error("Error deleting customer: ", error);
    throw new Error("Failed to delete customer.");
  }
}

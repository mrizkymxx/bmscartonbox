"use server";

import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";
import { CustomerEntity, PaginatedResult, PaginationParams, Customer } from "@/lib/schemas";
import { DatabaseError, NotFoundError, ValidationError, handleError } from "@/lib/errors";
import { customerEntitySchema } from "@/lib/schemas";
import { COLLECTIONS } from "@/lib/constants";

/**
 * Fetch all customers (for select dropdowns, etc.)
 */
export async function getAllCustomers(): Promise<CustomerEntity[]> {
  try {
    const snapshot = await adminDb.collection(COLLECTIONS.CUSTOMERS).get();
    
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
    
    // Get all customers first - in production, you'd want to implement proper server-side pagination
    let queryRef: any = adminDb.collection(COLLECTIONS.CUSTOMERS);
    
    // Apply ordering
    if (sortBy && sortOrder) {
      queryRef = queryRef.orderBy(sortBy, sortOrder as any);
    }
    
    const snapshot = await queryRef.get();
    let allCustomers = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      
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
          console.warn('Date conversion error for customer', doc.id, dateError);
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

    // Apply search filter client-side (in production, you'd want server-side filtering)
    if (search) {
      const searchLower = search.toLowerCase();
      allCustomers = allCustomers.filter((customer: any) => 
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination client-side
    const total = allCustomers.length;
    const startIndex = (page - 1) * pageLimit;
    const endIndex = startIndex + pageLimit;
    const customers = allCustomers.slice(startIndex, endIndex);

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

    const customerDoc = await adminDb.collection(COLLECTIONS.CUSTOMERS).doc(id).get();
    
    if (!customerDoc.exists) {
      throw new NotFoundError("Customer");
    }

    const data = customerDoc.data()!;
    
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
        console.warn('Date conversion error for customer', id, dateError);
      }
    }
    
    return {
      id: customerDoc.id,
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
      await adminDb.collection(COLLECTIONS.CUSTOMERS).doc(id).update(data);
    } else {
      // Create new customer
      await adminDb.collection(COLLECTIONS.CUSTOMERS).add({
        ...data,
        registered: new Date(),
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
    await adminDb.collection("customers").doc(id).delete();
    revalidatePath("/customers");
  } catch (error) {
    console.error("Error deleting customer: ", error);
    throw new Error("Failed to delete customer.");
  }
}

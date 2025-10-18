// Mock data for development and fallback when Firebase is not available
import { CustomerEntity } from "@/lib/schemas";
import { PurchaseOrder, Delivery } from "@/lib/types";

export const mockCustomers: CustomerEntity[] = [
  {
    id: "mock-1",
    name: "PT. Kemasan Karton",
    email: "info@kemasankarton.co.id",
    phone: "+62 21 1234 5678",
    address: "Jl. Industri No. 123, Jakarta",
    registered: new Date().toISOString(),
  },
  {
    id: "mock-2", 
    name: "CV. Box Solution",
    email: "contact@boxsolution.co.id",
    phone: "+62 21 8765 4321",
    address: "Jl. Packaging No. 456, Tangerang",
    registered: new Date().toISOString(),
  }
];

export const mockPurchaseOrders: PurchaseOrder[] = [];

export const mockDeliveries: Delivery[] = [];

export const isMockDataMode = process.env.NODE_ENV === 'production' && !process.env.FIREBASE_ADMIN_PRIVATE_KEY;

export function getMockOrRealData<T>(realData: T[], mockData: T[]): T[] {
  if (isMockDataMode) {
    console.log('🎭 Using mock data (Firebase Admin not available)');
    return mockData;
  }
  return realData;
}
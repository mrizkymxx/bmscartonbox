
// User roles for authentication and authorization
export type UserRole = 'admin' | 'editor' | 'viewer';

// Re-export types from schemas for backward compatibility
export type { 
  CustomerEntity as Customer, 
  OrderItemStatus, 
  OrderItemType,
  OrderItem,
  PurchaseOrder,
  DeliveryItem,
  Delivery,
  ProductionItem,
  ReadyToShipItem 
} from './schemas';

import { z } from 'zod';

// Base schemas for reusability
export const sizeSchema = z.object({
  length: z.coerce.number().positive('Length must be greater than 0'),
  width: z.coerce.number().positive('Width must be greater than 0'),
  height: z.coerce.number().nonnegative('Height must be non-negative'),
});

export const materialSizeSchema = z.object({
  length: z.coerce.number().positive('Length must be greater than 0'),
  width: z.coerce.number().positive('Width must be greater than 0'),
});

// Enums
export const OrderItemStatus = {
  DRAFT: 'Draft',
  IN_PRODUCTION: 'In Production',
  READY_TO_SHIP: 'Ready to Ship',
  SHIPPED: 'Shipped',
} as const;

export const OrderItemType = {
  BOX: 'Box',
  LAYER: 'Layer',
} as const;

export const OrderStatus = {
  OPEN: 'Open',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;

// Type exports from enums
export type OrderItemStatus = typeof OrderItemStatus[keyof typeof OrderItemStatus];
export type OrderItemType = typeof OrderItemType[keyof typeof OrderItemType];
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

// Zod schemas for validation
export const customerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  registered: z.string().datetime().optional(),
});

// Database entity schema (with required ID)
export const customerEntitySchema = customerSchema.extend({
  id: z.string(),
  registered: z.string().datetime(),
});

export const orderItemSchema = z.object({
  id: z.string().optional(),
  type: z.enum([OrderItemType.BOX, OrderItemType.LAYER]),
  name: z.string().min(3, 'Item name must be at least 3 characters'),
  layoutImage: z.string().url().optional(),
  materialSize: materialSizeSchema,
  finishedSize: sizeSchema,
  total: z.coerce.number().positive('Total must be greater than 0'),
  produced: z.coerce.number().nonnegative('Produced cannot be negative').default(0),
  delivered: z.coerce.number().nonnegative('Delivered cannot be negative').default(0),
  status: z.enum([
    OrderItemStatus.DRAFT,
    OrderItemStatus.IN_PRODUCTION,
    OrderItemStatus.READY_TO_SHIP,
    OrderItemStatus.SHIPPED,
  ]).default(OrderItemStatus.DRAFT),
  notes: z.string().optional(),
}).refine(
  (data) => data.type !== OrderItemType.BOX || data.finishedSize.height > 0,
  {
    message: 'Height is required for Box type items',
    path: ['finishedSize', 'height'],
  }
).refine(
  (data) => data.produced <= data.total,
  {
    message: 'Produced quantity cannot exceed total',
    path: ['produced'],
  }
).refine(
  (data) => data.delivered <= data.produced,
  {
    message: 'Delivered quantity cannot exceed produced',
    path: ['delivered'],
  }
);

export const purchaseOrderSchema = z.object({
  id: z.string().optional(),
  customerId: z.string().min(1, 'Customer must be selected'),
  customerName: z.string().min(1, 'Customer name is required'),
  poNumber: z.string().min(3, 'PO number must be at least 3 characters'),
  orderDate: z.string().datetime(),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  status: z.enum([OrderStatus.OPEN, OrderStatus.COMPLETED, OrderStatus.CANCELLED]).default(OrderStatus.OPEN),
  pdfUrl: z.string().url().optional(),
});

export const deliveryItemSchema = z.object({
  poId: z.string().min(1, 'PO ID is required'),
  orderItemId: z.string().min(1, 'Order item ID is required'),
  name: z.string().min(1, 'Item name is required'),
  poNumber: z.string().min(1, 'PO number is required'),
  quantity: z.coerce.number().positive('Quantity must be greater than 0'),
  type: z.enum([OrderItemType.BOX, OrderItemType.LAYER]),
  finishedSize: sizeSchema,
});

export const deliverySchema = z.object({
  id: z.string().optional(),
  deliveryNoteNumber: z.string().min(3, 'Delivery note number must be at least 3 characters'),
  customerId: z.string().min(1, 'Customer must be selected'),
  customerName: z.string().min(1, 'Customer name is required'),
  deliveryDate: z.string().datetime(),
  expedition: z.string().optional(),
  vehicleNumber: z.string().optional(),
  driverName: z.string().optional(),
  items: z.array(deliveryItemSchema).min(1, 'At least one item is required'),
});

// Type exports
export type Customer = z.infer<typeof customerSchema>;
export type CustomerEntity = z.infer<typeof customerEntitySchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type PurchaseOrder = z.infer<typeof purchaseOrderSchema>;
export type DeliveryItem = z.infer<typeof deliveryItemSchema>;
export type Delivery = z.infer<typeof deliverySchema>;

// Extended types for specific use cases
export interface ProductionItem extends OrderItem {
  poId: string;
  poNumber: string;
  customerName: string;
  orderDate: string;
}

export interface ReadyToShipItem extends ProductionItem {
  availableToShip: number;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form types for better form handling
export type CustomerFormData = Omit<Customer, 'id' | 'registered'>;
export type PurchaseOrderFormData = Omit<PurchaseOrder, 'id'>;
export type DeliveryFormData = Omit<Delivery, 'id'>;

// API response types
export interface ApiSuccess<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, any>;
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;
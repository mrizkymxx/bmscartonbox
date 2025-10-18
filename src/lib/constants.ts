// Application constants
export const APP_CONFIG = {
  NAME: 'BSM Carton Box',
  DESCRIPTION: 'Cardboard carton production management system',
  VERSION: '1.0.0',
  LOCALE: 'id-ID',
} as const;

// Database collection names
export const COLLECTIONS = {
  USERS: 'users',
  CUSTOMERS: 'customers',
  PURCHASE_ORDERS: 'purchase_orders',
  DELIVERIES: 'deliveries',
  PRODUCTION: 'production',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// File upload limits
export const FILE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['application/pdf'] as const,
  MAX_FILES: 5,
} as const;

// Business rules
export const BUSINESS_RULES = {
  MIN_ORDER_QUANTITY: 1,
  MAX_ORDER_QUANTITY: 1000000,
  MIN_CUSTOMER_NAME_LENGTH: 2,
  MIN_PO_NUMBER_LENGTH: 3,
  MIN_DELIVERY_NOTE_LENGTH: 3,
  MAX_ITEMS_PER_ORDER: 50,
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  STORAGE: 'iso', // ISO string format for database storage
} as const;

// Toast messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    CUSTOMER_CREATED: 'Customer berhasil ditambahkan',
    CUSTOMER_UPDATED: 'Data customer berhasil diperbarui',
    CUSTOMER_DELETED: 'Customer berhasil dihapus',
    ORDER_CREATED: 'Purchase Order berhasil dibuat',
    ORDER_UPDATED: 'Purchase Order berhasil diperbarui',
    ORDER_DELETED: 'Purchase Order berhasil dihapus',
    DELIVERY_CREATED: 'Surat jalan berhasil dibuat',
    DELIVERY_UPDATED: 'Surat jalan berhasil diperbarui',
    PDF_GENERATED: 'PDF berhasil dibuat',
    FILE_UPLOADED: 'File berhasil diupload',
  },
  ERROR: {
    GENERIC: 'Terjadi kesalahan. Silakan coba lagi.',
    NETWORK: 'Koneksi bermasalah. Periksa koneksi internet Anda.',
    VALIDATION: 'Data yang dimasukkan tidak valid',
    NOT_FOUND: 'Data tidak ditemukan',
    UNAUTHORIZED: 'Anda tidak memiliki akses',
    FILE_TOO_LARGE: 'Ukuran file terlalu besar (maksimal 10MB)',
    FILE_TYPE_INVALID: 'Tipe file tidak didukung',
    PDF_GENERATION_FAILED: 'Gagal membuat PDF. Periksa data dan coba lagi.',
  },
} as const;

// UI Constants
export const UI = {
  SIDEBAR_WIDTH: 280,
  MOBILE_BREAKPOINT: 768,
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
} as const;

// Status colors for UI
export const STATUS_COLORS = {
  Draft: 'bg-gray-100 text-gray-800',
  'In Production': 'bg-blue-100 text-blue-800',
  'Ready to Ship': 'bg-green-100 text-green-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Open: 'bg-yellow-100 text-yellow-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  UPLOAD_PDF: '/api/upload-pdf',
  CUSTOMERS: '/api/customers',
  ORDERS: '/api/orders',
  DELIVERIES: '/api/deliveries',
  PRODUCTION: '/api/production',
} as const;

export default {
  APP_CONFIG,
  COLLECTIONS,
  PAGINATION,
  FILE_LIMITS,
  BUSINESS_RULES,
  DATE_FORMATS,
  TOAST_MESSAGES,
  UI,
  STATUS_COLORS,
  API_ENDPOINTS,
};
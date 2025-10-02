// Error handling utilities
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 500, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

// Error handler utility
export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new AppError(error.message);
  }
  
  return new AppError('An unexpected error occurred');
};

// Response wrapper for consistent API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    field?: string;
  };
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export const createSuccessResponse = <T>(data: T, metadata?: ApiResponse['metadata']): ApiResponse<T> => ({
  success: true,
  data,
  metadata,
});

export const createErrorResponse = (error: AppError): ApiResponse => ({
  success: false,
  error: {
    message: error.message,
    code: error.code,
    field: error instanceof ValidationError ? error.field : undefined,
  },
});
# BSM Carton Box - Development Guide

## Architecture Overview

This application follows a modern Next.js architecture with the following principles:

### 🏗️ **Project Structure**

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components (shadcn/ui)
│   ├── layout/            # Layout components
│   └── [feature]/         # Feature-specific components
├── lib/                   # Utility libraries
│   ├── actions/           # Server actions
│   ├── config.ts          # Environment configuration
│   ├── constants.ts       # Application constants
│   ├── errors.ts          # Error handling utilities
│   ├── firebase.ts        # Firebase configuration
│   ├── logger.ts          # Logging utilities
│   ├── schemas.ts         # Zod validation schemas
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # General utilities
├── hooks/                 # Custom React hooks
└── types/                 # Global type declarations
```

### 🔧 **Tech Stack**

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Database**: Firebase Firestore
- **File Storage**: Vercel Blob
- **Forms**: React Hook Form + Zod
- **State Management**: React Context + Server Actions
- **PDF Generation**: jsPDF + jspdf-autotable

### 📋 **Code Standards**

#### **File Naming Conventions**
- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Types: `types.ts` or `schemas.ts`
- Actions: `kebab-case.ts`

#### **Component Structure**
```typescript
// 1. Imports (external first, then internal)
import React from 'react'
import { Button } from '@/components/ui/button'

// 2. Types/Interfaces
interface ComponentProps {
  title: string
  optional?: boolean
}

// 3. Component
export function Component({ title, optional = false }: ComponentProps) {
  // Component logic
  return <div>{title}</div>
}
```

#### **Error Handling**
- Use custom error classes from `@/lib/errors`
- Always wrap async operations in try-catch
- Log errors using the logger utility
- Provide user-friendly error messages

#### **Validation**
- Use Zod schemas for all data validation
- Define schemas in `@/lib/schemas.ts`
- Validate both client and server-side

### 🚀 **Development Workflow**

#### **Getting Started**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Building
npm run build
```

#### **Code Quality**
- Run `npm run lint` before committing
- Use TypeScript strict mode
- Write descriptive commit messages
- Add JSDoc comments for complex functions

### 📦 **Database Schema**

#### **Collections Structure**

**customers**
```typescript
{
  id: string
  name: string
  email: string
  phone: string
  address: string
  registered: Timestamp
}
```

**purchaseOrders**
```typescript
{
  id: string
  customerId: string
  customerName: string
  poNumber: string
  orderDate: Timestamp
  items: OrderItem[]
  status: 'Open' | 'Completed' | 'Cancelled'
  pdfUrl?: string
}
```

**deliveries**
```typescript
{
  id: string
  deliveryNoteNumber: string
  customerId: string
  customerName: string
  deliveryDate: Timestamp
  expedition?: string
  vehicleNumber?: string
  driverName?: string
  items: DeliveryItem[]
}
```

### 🔒 **Security Considerations**

- Environment variables are validated on startup
- Firebase security rules should be properly configured
- File uploads are validated for type and size
- User input is always validated with Zod schemas

### 📊 **Performance Optimizations**

- Components are lazy-loaded where appropriate
- Images use Next.js Image optimization
- Bundle analysis available with `npm run analyze`
- Database queries are optimized with proper indexing

### 🧪 **Testing Strategy**

- Unit tests for utility functions
- Integration tests for API routes
- Component tests for complex UI logic
- E2E tests for critical user flows

### 🚀 **Deployment**

The application is optimized for deployment on Vercel with:
- Automatic deployments from Git
- Environment variable management
- Serverless functions for API routes
- Edge runtime where appropriate

### 📝 **Contributing**

1. Create a feature branch from `main`
2. Make your changes following the code standards
3. Run tests and linting
4. Create a pull request with a descriptive title
5. Request review from team members

### 🔧 **Troubleshooting**

#### Common Issues

**Firebase Connection Issues**
- Check environment variables
- Verify Firebase project configuration
- Check network connectivity

**Build Errors**
- Run `npm run typecheck` to identify TypeScript issues
- Check for missing dependencies
- Verify environment variables are set

**PDF Generation Issues**
- Ensure jspdf-autotable is properly imported
- Check data validation before PDF generation
- Verify browser compatibility

### 📚 **Additional Resources**

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
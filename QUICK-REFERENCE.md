# 🎯 Quick Reference Guide

## 📚 **File Locations & Patterns**

### **Critical Files to Fix First**
```
🚨 SECURITY ISSUES:
├── src/app/login/page.tsx          # Remove "kikicool" 
├── src/components/auth-provider.tsx # Replace localStorage auth
├── next.config.ts                  # Remove ignoreBuildErrors
└── tsconfig.json                   # Enable strict mode

🔧 ERROR HANDLING:
├── src/lib/actions/customers.ts    # Replace throw new Error()
├── src/lib/actions/purchase-orders.ts
├── src/lib/actions/deliveries.ts
└── src/lib/actions/production.ts
```

### **New Files to Create**
```
📁 CREATE THESE FILES:
├── src/middleware.ts               # Security & rate limiting  
├── src/lib/auth.ts                # Firebase auth functions
├── src/components/error-boundary.tsx # React error boundary
├── firestore.rules                 # Database security
├── .env.example                    # Environment template
├── jest.config.js                  # Testing configuration
└── __tests__/                     # Test files folder
```

## ⚡ **Command Cheat Sheet**

### **Development Commands**
```bash
# Start development server
npm run dev

# Type checking (run this often!)
npm run typecheck

# Check for linting issues
npm run lint

# Build for production (should pass!)
npm run build

# Run tests (after setup)
npm test
npm run test:coverage
```

### **Git Workflow**
```bash
# Daily workflow
git checkout main
git pull origin main
git checkout -b feature/fix-authentication
# ... make changes ...
git add .
git commit -m "fix: replace hardcoded authentication"
git push origin feature/fix-authentication
```

## 🛠️ **Common Fix Patterns**

### **1. Replace Hardcoded Auth**
```typescript
// ❌ REMOVE THIS (in login/page.tsx):
const hardcodedPassword = "kikicool";
if (password === hardcodedPassword) {
  localStorage.setItem("isLoggedIn", "true");
}

// ✅ REPLACE WITH:
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const handleLogin = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    // Handle error properly
  }
};
```

### **2. Fix Error Handling**
```typescript
// ❌ CURRENT PATTERN:
try {
  // some operation
} catch (error) {
  console.error("Error:", error);
  throw new Error("Failed to do something");
}

// ✅ REPLACE WITH:
import { DatabaseError, handleError } from '@/lib/errors';

try {
  // some operation  
} catch (error) {
  logger.error("Database operation failed", error);
  throw new DatabaseError("Failed to do something");
}
```

### **3. Add TypeScript Types**
```typescript
// ❌ AVOID:
const handleSubmit = (data: any) => {
  // ...
}

// ✅ PREFER:
interface FormData {
  name: string;
  email: string;
}

const handleSubmit = (data: FormData) => {
  // ...
}
```

## 📋 **Testing Patterns**

### **Unit Test Template**
```typescript
// __tests__/lib/utils.test.ts
import { formatDate, formatCurrency } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-01-01');
      const formatted = formatDate(date);
      expect(formatted).toBe('01 Jan 2025');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency in IDR', () => {
      const amount = 1000000;
      const formatted = formatCurrency(amount);
      expect(formatted).toBe('Rp 1.000.000');
    });
  });
});
```

### **Component Test Template**
```typescript
// __tests__/components/customer-form.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomerForm } from '@/components/customers/customer-form';

describe('CustomerForm', () => {
  it('should validate required fields', async () => {
    render(<CustomerForm />);
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  });
});
```

## 🎯 **Priority Decision Matrix**

### **When to Stop and Ask for Help**
```
🔴 STOP IMMEDIATELY:
- Security vulnerability found
- Data corruption risk
- Build completely broken >2 hours

🟡 ASK FOR HELP AFTER 2 HOURS:  
- Complex TypeScript errors
- Firebase configuration issues
- Testing setup problems

🟢 CONTINUE WORKING:
- UI/UX improvements
- Performance optimizations
- Code refactoring
```

### **Task Priority Rules**
1. **Security First**: Always fix auth and security issues
2. **Build Must Pass**: Don't add features if build is broken  
3. **Tests Must Pass**: Don't ignore failing tests
4. **One Thing at a Time**: Focus on single issue
5. **Document Decisions**: Update roadmap with changes

## 📊 **Daily Progress Template**

Copy this to track your daily work:

```markdown
## Daily Log - [DATE]

### ✅ Completed Today
- [ ] Task 1
- [ ] Task 2

### ❌ Blocked/Issues
- Issue description
- What you tried
- Next steps

### 📝 Notes
- Important discoveries
- Links to helpful resources  

### 🎯 Tomorrow's Priority
1. Most important task
2. Second priority
3. Third priority

### ⏰ Time Spent
- Phase 1 tasks: ___ hours
- Phase 2 tasks: ___ hours  
- Research/debugging: ___ hours
```

## 🆘 **Emergency Contacts & Resources**

### **When Stuck, Try These:**
1. **Firebase Issues**: [Firebase Documentation](https://firebase.google.com/docs)
2. **TypeScript Errors**: [TypeScript Handbook](https://www.typescriptlang.org/docs/)  
3. **React Testing**: [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
4. **Next.js Issues**: [Next.js Documentation](https://nextjs.org/docs)

### **Code Quality Checklist**
Before committing any changes:

```bash
# Run these commands:
npm run typecheck  # Must pass
npm run lint       # Must pass  
npm run build      # Must pass
npm test          # Must pass (after tests are setup)

# Check these manually:
# - No console.log in production code
# - No hardcoded values  
# - Proper error handling
# - TypeScript types added
```

---

*Keep this file handy and refer to it daily!*
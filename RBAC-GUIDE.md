# 🔐 Role-Based Access Control (RBAC) Implementation

## 📋 **Overview**
Aplikasi BSM Carton Box sekarang mendukung sistem role-based access control dengan dua role utama: **Admin** dan **Viewer**.

## 👥 **User Roles**

### 🔧 **Admin Role**
- **Full Access**: Dapat melakukan semua operasi CRUD
- **Permissions**:
  - ✅ Create, Read, Update, Delete Customers
  - ✅ Create, Read, Update, Delete Purchase Orders  
  - ✅ View, Update Production status
  - ✅ Create, Read, Update, Delete Deliveries
  - ✅ View, Edit Settings

### 👁️ **Viewer Role**
- **Read-Only Access**: Hanya dapat melihat data, tidak bisa melakukan perubahan
- **Permissions**:
  - ✅ View Customers (no create/edit/delete)
  - ✅ View Purchase Orders (no create/edit/delete)
  - ✅ View Production status (no updates)
  - ✅ View Deliveries (no create/edit/delete)
  - ✅ View Settings (no edit)

## 🔑 **Login Credentials**

### Demo Users
```
Admin User:
- Username: admin
- Password: admin123
- Full access to all features

Viewer User:  
- Username: viewer
- Password: viewer123
- Read-only access
```

## 🛠️ **Technical Implementation**

### **Files Structure**
```
src/
├── lib/
│   └── auth-types.ts           # Role definitions & permissions
├── contexts/
│   └── auth-context.tsx        # Authentication context
├── components/
│   ├── auth-guard.tsx          # Route protection
│   └── protected-action.tsx    # Component-level permissions
└── app/
    ├── layout.tsx              # Updated with new auth system
    └── login/page.tsx          # Multi-user login
```

### **Permission System**
```typescript
// Check permissions in components
const { canCreate, canEdit, canDelete, canView } = useAuth();

// Usage examples:
if (canCreate('customers')) {
  // Show create button
}

if (canEdit('customers')) {
  // Show edit button  
}
```

### **Protected Components**
```tsx
// Protect specific actions
<ProtectedAction resource="customers" action="create">
  <Button>Add Customer</Button>
</ProtectedAction>

// Role-based rendering
<RoleBased allowedRoles={['admin']}>
  <AdminOnlyComponent />
</RoleBased>
```

## 🔄 **Migration from Old System**

### **What Changed:**
1. **Authentication**: 
   - ❌ Old: Hard-coded password `"kikicool"`
   - ✅ New: Multi-user with username/password

2. **Authorization**: 
   - ❌ Old: No role system  
   - ✅ New: Admin vs Viewer permissions

3. **Session Management**:
   - ❌ Old: Simple `localStorage.setItem("isLoggedIn", "true")`
   - ✅ New: User object with role stored in localStorage

### **Breaking Changes:**
- Login page now requires username AND password
- Some buttons/actions may be hidden for Viewer role
- User navigation shows role badge

## 🧪 **Testing the System**

### **Test Scenarios:**

#### **1. Admin Login Test**
1. Go to `/login`
2. Enter: `admin` / `admin123`  
3. Should see:
   - ✅ Dashboard accessible
   - ✅ "Add Customer" button visible
   - ✅ Edit/Delete actions in dropdown menus
   - ✅ "ADMIN" badge in user nav

#### **2. Viewer Login Test**
1. Go to `/login`
2. Enter: `viewer` / `viewer123`
3. Should see:
   - ✅ Dashboard accessible  
   - ❌ "Add Customer" button hidden (shows "View-only mode")
   - ❌ Edit/Delete actions hidden in dropdown menus
   - ✅ "VIEWER" badge in user nav

#### **3. Dashboard Navigation Test**
1. Login as any user
2. Click "Dashboard" in sidebar
3. Should see:
   - ✅ Dashboard loads without redirect to `/production`
   - ✅ No infinite redirect loops
   - ✅ Stats cards display correctly

## 🚀 **Next Steps for Enhancement**

### **Phase 1: Immediate (Optional)**
- [ ] Add more granular permissions per module
- [ ] Add user management interface for Admin
- [ ] Implement password change functionality

### **Phase 2: Future (Recommended)**  
- [ ] Replace hard-coded users with Firebase Auth
- [ ] Add user registration flow
- [ ] Implement JWT tokens for security
- [ ] Add audit logs for user actions

### **Phase 3: Advanced**
- [ ] Add department-based permissions
- [ ] Implement approval workflows
- [ ] Add multi-tenant support

## 🐛 **Troubleshooting**

### **Common Issues:**

#### **"Cannot find module '@/components/auth-guard'"**
**Solution**: Make sure you've created the `auth-guard.tsx` file

#### **"Cannot access dashboard"**  
**Solution**: Check if redirect is removed from `next.config.ts`

#### **"Buttons not showing for admin"**
**Solution**: Check console for permission errors, ensure role is set correctly

#### **"Infinite redirect on login"**
**Solution**: Clear localStorage and try again:
```javascript
localStorage.clear()
```

## 📝 **Code Examples**

### **Check User Role in Component**
```tsx
import { useAuth } from '@/contexts/auth-context';

function MyComponent() {
  const { user, canCreate } = useAuth();
  
  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <p>Role: {user?.role}</p>
      
      {canCreate('customers') && (
        <button>Add Customer</button>  
      )}
    </div>
  );
}
```

### **Protect Entire Page**
```tsx
import { ProtectedAction } from '@/components/protected-action';

function AdminPage() {
  return (
    <ProtectedAction 
      resource="settings" 
      action="edit"
      fallback={<div>Access Denied</div>}
    >
      <AdminSettings />
    </ProtectedAction>
  );
}
```

---

## 📞 **Support**

Jika ada masalah dengan sistem role:
1. Check browser console untuk errors
2. Verify login credentials  
3. Clear localStorage dan coba login ulang
4. Check komponen menggunakan `ProtectedAction` dengan benar

*Last Updated: October 16, 2025*
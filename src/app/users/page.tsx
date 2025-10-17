import { getUsers } from "@/lib/actions/users";
import { DataTable } from "@/components/users/data-table";
import { RoleGuard } from "@/components/auth/role-guard";
import AppLayout from "@/components/layout/app-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldX } from "lucide-react";

// Force dynamic rendering untuk authentication
export const dynamic = 'force-dynamic';

async function UsersContent() {
  const usersResult = await getUsers(50); // Get first 50 users
  const users = usersResult.data;

  return (
    <RoleGuard 
      requiredRole="admin"
      fallback={
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Access Denied
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              You don't have permission to access this page
            </p>
          </div>
          
          <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
            <ShieldX className="h-4 w-4" />
            <AlertTitle>Admin Access Required</AlertTitle>
            <AlertDescription>
              User Management is restricted to administrators only. 
              Please contact your system administrator if you need access to this feature.
            </AlertDescription>
          </Alert>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>

        {/* Users Table */}
        <div className="space-y-4">
          <DataTable 
            columns={[]} // Will be generated dynamically
            data={users} 
            searchKey="email"
            searchPlaceholder="Search users by email..."
          />
        </div>
      </div>
    </RoleGuard>
  );
}

export default function UsersPage() {
  return (
    <AppLayout>
      <UsersContent />
    </AppLayout>
  );
}
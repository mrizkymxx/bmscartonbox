import { getUsers } from "@/lib/actions/users";
import { columns } from "@/components/users/columns";
import { DataTable } from "@/components/users/data-table";
import AppLayout from "@/components/layout/app-layout";

// Force dynamic rendering untuk authentication
export const dynamic = 'force-dynamic';

async function UsersContent() {
  const usersResult = await getUsers(50); // Get first 50 users
  const users = usersResult.data;

  return (
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
          columns={columns} 
          data={users} 
          searchKey="email"
          searchPlaceholder="Search users by email..."
        />
      </div>
    </div>
  );
}

export default function UsersPage() {
  return (
    <AppLayout>
      <UsersContent />
    </AppLayout>
  );
}
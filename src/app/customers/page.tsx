
import { getCustomers } from "@/lib/actions/customers";
import { columns } from "@/components/customers/columns";
import { DataTable } from "@/components/customers/data-table";
import AppLayout from "@/components/layout/app-layout";

// Force dynamic rendering untuk authentication
export const dynamic = 'force-dynamic';

async function CustomersContent() {
  const customerResult = await getCustomers();
  const customers = customerResult.data;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Customer Management
        </h1>
        <p className="text-base md:text-lg text-muted-foreground">
          Manage and view all registered customers
        </p>
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-lg">
        <DataTable data={customers} columns={columns} />
      </div>
    </div>
  );
}


export default async function CustomersPage() {
    return (
        <AppLayout
            title="Customers"
            description="Customer management and information"
        >
            <CustomersContent />
        </AppLayout>
    )
}

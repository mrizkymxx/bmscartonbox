
import { getDeliveries } from "@/lib/actions/deliveries";
import { columns } from "@/components/deliveries/columns";
import { DataTable } from "@/components/deliveries/data-table";
import AppLayout from "@/components/layout/app-layout";

// Force dynamic rendering untuk authentication
export const dynamic = 'force-dynamic';

async function DeliveriesContent() {
  const deliveries = await getDeliveries();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Delivery Management
        </h1>
        <p className="text-base md:text-lg text-muted-foreground">
          Track and manage all deliveries
        </p>
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-lg">
        <DataTable data={deliveries} columns={columns} />
      </div>
    </div>
  );
}

export default async function DeliveriesPage() {
    return (
        <AppLayout
            title="Deliveries"
            description="Delivery management and tracking"
        >
            <DeliveriesContent />
        </AppLayout>
    )
}

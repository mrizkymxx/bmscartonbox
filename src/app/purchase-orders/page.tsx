
import { getPurchaseOrders } from "@/lib/actions/purchase-orders";
import { columns } from "@/components/purchase-orders/columns";
import { DataTable } from "@/components/purchase-orders/data-table";
import AppLayout from "@/components/layout/app-layout";

async function PurchaseOrdersContent() {
  const purchaseOrders = await getPurchaseOrders();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Purchase Orders
        </h1>
        <p className="text-base md:text-lg text-muted-foreground">
          Manage and track all purchase orders
        </p>
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-lg">
        <DataTable data={purchaseOrders} columns={columns} />
      </div>
    </div>
  );
}

export default async function PurchaseOrdersPage() {
    return (
        <AppLayout
            title="Purchase Orders"
            description="Order processing and management"
        >
            <PurchaseOrdersContent />
        </AppLayout>
    )
}

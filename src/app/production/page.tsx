
import { getProductionItems } from "@/lib/actions/production";
import { columns } from "@/components/production/columns";
import { DataTable } from "@/components/production/data-table";
import AppLayout from "@/components/layout/app-layout";

// Force dynamic rendering untuk authentication
export const dynamic = 'force-dynamic';

async function ProductionContent() {
  const productionItems = await getProductionItems();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Production Tracking
        </h1>
        <p className="text-base md:text-lg text-muted-foreground">
          Monitor and update production progress for delivery preparation
        </p>
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-lg">
        <DataTable data={productionItems} columns={columns} />
      </div>
    </div>
  );
}


export default async function ProductionPage() {
    return (
        <AppLayout
            title="Production"
            description="Production tracking and management"
        >
            <ProductionContent />
        </AppLayout>
    )
}

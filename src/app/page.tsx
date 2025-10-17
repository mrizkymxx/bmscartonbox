import AppLayout from '@/components/layout/app-layout';
import { StatsCards } from '@/components/dashboard/stats-cards';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Force dynamic rendering untuk authentication
export const dynamic = 'force-dynamic';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getPurchaseOrders } from '@/lib/actions/purchase-orders';
import { getAllCustomers } from '@/lib/actions/customers';
import { getDeliveries } from '@/lib/actions/deliveries';
import { FileText, Truck, TrendingUp, Package, Users, Calendar } from 'lucide-react';
import OverviewChartWrapper from '@/components/dashboard/overview-chart.client';

export const metadata = {
  title: 'BSMcarton',
};

type RecentActivity = {
    id: string;
    type: 'PO' | 'Delivery';
    date: string;
    title: string;
    description: string;
};

async function DashboardPage() {
  const purchaseOrders = await getPurchaseOrders();
  const customers = await getAllCustomers();
  const deliveries = await getDeliveries();

  const activePOCount = purchaseOrders.filter(po => po.status === 'Open').length;
  
  const readyToShipCount = purchaseOrders
    .filter(po => po.status === 'Open')
    .flatMap(po => po.items)
    .reduce((sum, item) => {
        const available = (item.produced || 0) - (item.delivered || 0);
        return sum + (available > 0 ? available : 0);
    }, 0);

  const deliveriesThisMonth = deliveries.filter(d => {
    const deliveryDate = new Date(d.deliveryDate);
    const now = new Date();
    return deliveryDate.getMonth() === now.getMonth() && deliveryDate.getFullYear() === now.getFullYear();
  }).length;
  
  const poActivities: RecentActivity[] = purchaseOrders.map(po => ({
    id: `po-${po.id}`,
    type: 'PO',
    date: po.orderDate,
    title: `New PO: ${po.poNumber}`,
    description: `From: ${po.customerName}`,
  }));

  const deliveryActivities: RecentActivity[] = deliveries.map(d => ({
    id: `delivery-${d.id}`,
    type: 'Delivery',
    date: d.deliveryDate,
    title: `Delivery Note Created: ${d.deliveryNoteNumber}`,
    description: `To: ${d.customerName}`,
  }));

  const recentActivities = [...poActivities, ...deliveryActivities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);


  return (
    <div className="space-y-8 md:space-y-12">
      {/* Clean Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Welcome back
        </h1>
        <p className="text-base md:text-lg text-muted-foreground">
          Here's your production overview for today
        </p>
      </div>

      {/* Stats Cards - Notion Style */}
      <StatsCards
        totalCustomers={customers.length}
        activePOCount={activePOCount}
        readyToShipCount={readyToShipCount}
        deliveriesThisMonth={deliveriesThisMonth}
      />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Recent Activities */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg md:text-xl font-semibold text-foreground">Recent Activities</h2>
            <p className="text-sm text-muted-foreground">Latest updates from your workflow</p>
          </div>

          <Card className="bg-card border border-border">
            <CardContent className="p-4 md:p-6">
              <div className="space-y-3 md:space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-2 md:py-3 border-b border-border last:border-b-0">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'PO'
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                          : 'bg-green-50 dark:bg-green-900/20 text-green-600'
                      }`}>
                        {activity.type === 'PO' ?
                          <FileText className="w-4 h-4" /> :
                          <Truck className="w-4 h-4" />
                        }
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="font-medium text-foreground text-sm truncate">
                          {activity.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {activity.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="text-xs font-medium text-foreground">
                        {new Date(activity.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Production Overview */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg md:text-xl font-semibold text-foreground">Production Overview</h2>
            <p className="text-sm text-muted-foreground">Monthly production summary</p>
          </div>

          <Card className="bg-card border border-border">
            <CardContent className="p-4 md:p-6">
              <OverviewChartWrapper orders={purchaseOrders} deliveries={deliveries} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default async function Dashboard() {
    return (
        <AppLayout
            title="Dashboard"
            description="Production overview and analytics"
        >
            <DashboardPage />
        </AppLayout>
    )
}

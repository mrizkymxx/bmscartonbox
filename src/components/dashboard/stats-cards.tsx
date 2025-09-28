
import { Card, CardContent } from '@/components/ui/card';
import { Users, Package, Truck, Boxes, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardsProps {
    totalCustomers: number;
    activePOCount: number;
    readyToShipCount: number;
    deliveriesThisMonth: number;
}

export function StatsCards({
    totalCustomers,
    activePOCount,
    readyToShipCount,
    deliveriesThisMonth
}: StatsCardsProps) {

  const stats = [
    {
      title: "Total Customers",
      value: totalCustomers,
      description: "Registered customers",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      trend: null
    },
    {
      title: "Active POs",
      value: activePOCount,
      description: "Unfinished orders",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      trend: null
    },
    {
      title: "Ready to Ship",
      value: readyToShipCount.toLocaleString(),
      description: "Items pending delivery",
      icon: Boxes,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      trend: null
    },
    {
      title: "This Month",
      value: deliveriesThisMonth,
      description: "Deliveries completed",
      icon: Truck,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      trend: null
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-card border border-border hover:bg-secondary/50 transition-colors duration-150 shadow-sm hover:shadow-md">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
                    {stat.title}
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-foreground truncate">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {stat.description}
                  </p>
                </div>
                <div className="w-8 h-8 bg-secondary/80 rounded-md flex items-center justify-center flex-shrink-0 ml-3 ring-1 ring-border/50">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

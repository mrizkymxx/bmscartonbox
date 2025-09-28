"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  Truck,
  Settings
} from "lucide-react"

const navItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview & Analytics"
    },
    {
      href: "/customers",
      label: "Customers",
      icon: Users,
      description: "Customer Management"
    },
    {
      href: "/purchase-orders",
      label: "Purchase Orders",
      icon: FileText,
      description: "Order Processing"
    },
    {
      href: "/production",
      label: "Production",
      icon: Package,
      description: "Production Tracking"
    },
    {
      href: "/deliveries",
      label: "Deliveries",
      icon: Truck,
      description: "Delivery Management"
    },
]

interface SidebarNavigationProps {
  onLinkClick?: () => void;
}

export function SidebarNavigation({ onLinkClick }: SidebarNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            )}
          >
            <Icon className={cn(
              "h-4 w-4 transition-colors duration-200",
              isActive
                ? "text-primary"
                : "text-muted-foreground group-hover:text-foreground"
            )} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  )
}

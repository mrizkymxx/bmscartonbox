"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  Truck,
} from "lucide-react";

const navItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/customers",
      label: "Customers",
      icon: Users,
    },
    {
      href: "/purchase-orders",
      label: "Purchase Orders",
      icon: FileText,
    },
    {
      href: "/production",
      label: "Production",
      icon: Package,
    },
    {
      href: "/deliveries",
      label: "Deliveries",
      icon: Truck,
    },
];

export function MobileSidebar() {
    const pathname = usePathname();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 p-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <DropdownMenuItem key={item.href} asChild>
                            <Link
                                href={item.href}
                                className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-sm transition-colors ${
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </Link>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

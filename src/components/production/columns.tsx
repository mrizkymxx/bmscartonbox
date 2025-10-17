
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ProductionItem } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Progress } from "../ui/progress"


export const columns: ColumnDef<ProductionItem>[] = [
  {
    accessorKey: "name",
    header: "Item Name",
    cell: ({row}) => {
        const item = row.original;
        return (
            <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-xs text-muted-foreground">
                    {item.finishedSize ? (item.type === 'Box' ? `${item.finishedSize.length}x${item.finishedSize.width}x${item.finishedSize.height} cm` : `${item.finishedSize.length}x${item.finishedSize.width} cm`) : '-'}
                </div>
            </div>
        )
    }
  },
  {
    accessorKey: "customerName",
    header: "Customer",
     cell: ({row}) => {
        const item = row.original;
        return (
            <div>
                <div className="font-semibold">{item.customerName}</div>
                <div className="text-xs text-muted-foreground">PO: {item.poNumber}</div>
            </div>
        )
    }
  },
  {
    accessorKey: "total",
    header: "Order Qty",
    cell: ({row}) => {
      const item = row.original;
      return <span className="font-semibold">{item.total.toLocaleString()}</span>
    }
  },
  {
    accessorKey: "produced",
    header: "Delivery Progress",
    cell: ({ row }) => {
      const item = row.original;
      const delivered = item.delivered || 0;
      const produced = item.produced || 0;
      const availableToShip = produced - delivered;
      // Progress bar shows DELIVERY progress (delivered vs total order)
      const deliveryProgress = item.total > 0 ? (delivered / item.total) * 100 : 0;
      
      return (
        <div className="flex flex-col gap-1.5 w-56">
           <Progress value={deliveryProgress} className="h-2" />
           <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground">
                <span className="font-semibold">Produced: {produced.toLocaleString()}</span>
                <span className="font-semibold text-center">Delivered: {delivered.toLocaleString()}</span>
                <span className={`font-semibold text-right ${availableToShip > 0 ? 'text-green-600' : ''}`}>
                  Ready: {availableToShip.toLocaleString()}
                </span>
           </div>
           <div className="text-xs text-muted-foreground text-center">
             Delivery Progress: {deliveryProgress.toFixed(1)}%
           </div>
        </div>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const item = row.original;
      const delivered = item.delivered || 0;
      
      const isCompleted = delivered >= item.total;
      const status = isCompleted ? "Completed" : "In Progress";
      const variant = isCompleted ? "default" : "secondary";

      return <Badge variant={variant}>{status}</Badge>
    }
  },
]

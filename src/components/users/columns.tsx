"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserProfile } from "@/lib/actions/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, UserCheck, UserX, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const columns: ColumnDef<UserProfile>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{user.email}</span>
          <span className="text-sm text-muted-foreground">{user.displayName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const variant = role === "admin" ? "default" : role === "editor" ? "secondary" : "outline";
      
      return (
        <Badge variant={variant} className="capitalize">
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      const department = row.getValue("department") as string;
      return department || "-";
    },
  },
  {
    accessorKey: "emailVerified",
    header: "Email Status",
    cell: ({ row }) => {
      const verified = row.getValue("emailVerified") as boolean;
      return (
        <Badge variant={verified ? "default" : "destructive"}>
          {verified ? "Verified" : "Unverified"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "disabled",
    header: "Account Status",
    cell: ({ row }) => {
      const disabled = row.getValue("disabled") as boolean;
      return (
        <Badge variant={disabled ? "destructive" : "default"}>
          {disabled ? "Disabled" : "Active"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastSignInTime",
    header: "Last Sign In",
    cell: ({ row }) => {
      const lastSignIn = row.getValue("lastSignInTime") as Date | undefined;
      if (!lastSignIn) return "Never";
      
      return formatDistanceToNow(lastSignIn, { addSuffix: true });
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date;
      return formatDistanceToNow(createdAt, { addSuffix: true });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Password Reset
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {user.disabled ? (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Enable Account
                </>
              ) : (
                <>
                  <UserX className="mr-2 h-4 w-4" />
                  Disable Account
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
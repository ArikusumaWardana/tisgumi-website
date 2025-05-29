"use client";

import { StatusBadge } from "@/components/ui/status-badge";
import { ActionMenu } from "@/components/ui/action-menu";
import { Categories } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Categories>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Code",
    accessorKey: "code",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Created At",
    accessorKey: "created_at",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }) => (
      <ActionMenu
        onEdit={() => console.log("Edit", row.original.id)}
        onView={() => console.log("View", row.original.id)}
        onDelete={() => console.log("Delete", row.original.id)}
      />
    ),
  },
];

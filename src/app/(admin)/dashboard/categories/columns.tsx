"use client";

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
    cell: ({ row }) => {
      const category = row.original;
      return (
        <ActionMenu
          onEdit={`/dashboard/categories/edit/${category.id}`}
          onView={() => console.log("View", category.id)}
          onDelete={() => console.log("Delete", category.id)}
        />
      );
    },
  },
];

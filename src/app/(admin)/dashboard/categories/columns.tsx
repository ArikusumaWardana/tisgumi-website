"use client";

import { ActionMenu } from "@/components/ui/action-menu";
import { Categories } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { formatIndonesianDate } from "@/utils/date-utils";
import FormDelete from "./_components/form-delete";

export const columns: ColumnDef<Categories>[] = [
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
    cell: ({ row }) => formatIndonesianDate(row.original.created_at),
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <ActionMenu
          onEdit={`/dashboard/categories/edit/${category.id}`}
          onDelete={<FormDelete id={category.id} />}
        />
      );
    },
  },
];

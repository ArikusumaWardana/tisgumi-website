"use client";

import { ActionMenu } from "@/components/ui/action-menu";
import { Product, Categories } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { formatIndonesianDate } from "@/utils/date-utils";
import FormDelete from "./_components/form-delete";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatToRupiah } from "@/utils/currency";

// Type for Product with Category relation
type ProductWithCategory = Product & {
  category: Categories;
};

export const columns: ColumnDef<ProductWithCategory>[] = [
  {
    header: "Code",
    accessorKey: "code",
  },
  {
    header: "Product Name",
    accessorKey: "name",
  },
  {
    header: "Category",
    accessorKey: "category.name",
    cell: ({ row }) => {
      const product = row.original;
      return product.category?.name || "No Category";
    },
  },
  {
    header: "Default Price",
    accessorKey: "default_price",
    cell: ({ row }) => {
      const product = row.original;
      return `Rp ${formatToRupiah(product.default_price.toString())}`;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const product = row.original;
      return <StatusBadge status={product.status} />;
    },
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
      const product = row.original;
      return (
        <ActionMenu
          onEdit={`/dashboard/products/edit/${product.id}`}
          onDelete={<FormDelete id={product.id} />}
        />
      );
    },
  },
];

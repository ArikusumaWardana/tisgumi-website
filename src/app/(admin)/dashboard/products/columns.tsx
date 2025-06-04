"use client";

import { ActionMenu } from "@/components/ui/action-menu";
import { ColumnDef } from "@tanstack/react-table";
import { formatIndonesianDate } from "@/utils/date-utils";
import FormDelete from "./_components/form-delete";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatToRupiah } from "@/utils/currency";
import { User } from "lucia";

// Type for product with category based on our data structure
type Product = {
  id: number;
  code: string;
  name: string;
  default_price: number;
  status: string;
  category_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  category: {
    id: number;
    code: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  };
};

// Function to create columns with user-aware ActionMenu
export const createProductColumns = (
  user: User | null
): ColumnDef<Product>[] => [
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
      return <StatusBadge status={product.category.name ?? "No Category"} />;
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
          user={user}
          module="products"
          requiresSuperadmin={true}
        />
      );
    },
  },
];

// Export static columns for backward compatibility (without role restrictions)
export const columns = createProductColumns(null);

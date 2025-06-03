"use client";

import { ActionMenu } from "@/components/ui/action-menu";
import { StatusBadge } from "@/components/ui/status-badge";
import { ColumnDef } from "@tanstack/react-table";
import { formatIndonesianDate } from "@/utils/date-utils";
import FormDelete from "./_components/form-delete";

// Define the order type based on what getOrdersPaginated returns
type OrderWithDetails = {
  id: number;
  code: string;
  customer_id: number;
  created_by_user_id: number;
  status: string;
  payment_date: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  customer: {
    id: number;
    code: string;
    name: string;
    phone: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  };
  created_by_user: {
    id: number;
    name: string;
    code: string;
  };
  order_items: Array<{
    id: number;
    code: string;
    order_id: number;
    product_id: number;
    quantity: number;
    price_at_time: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    product: {
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
  }>;
  invoices: Array<{
    id: number;
    order_id: number;
    file_url: string;
    show_price: boolean;
    created_at: Date;
  }>;
  total_amount: number;
  total_items: number;
};

export const columns: ColumnDef<OrderWithDetails>[] = [
  {
    header: "Order Code",
    accessorKey: "code",
  },
  {
    header: "Customer",
    accessorKey: "customer.name",
    cell: ({ row }) => {
      const customer = row.original.customer;
      return (
        <div>
          <p className="font-medium">{customer.name}</p>
          <p className="text-sm text-gray-500">{customer.code}</p>
        </div>
      );
    },
  },
  {
    header: "Total Items",
    accessorKey: "total_items",
    cell: ({ row }) => {
      return <span>{row.original.total_items} items</span>;
    },
  },
  {
    header: "Total Amount",
    accessorKey: "total_amount",
    cell: ({ row }) => {
      return (
        <span className="font-medium">
          Rp {row.original.total_amount.toLocaleString()}
        </span>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status === "lunas" ? "Lunas" : "Belum Lunas";
      return <StatusBadge status={status} />;
    },
  },
  {
    header: "Created By",
    accessorKey: "created_by_user.name",
    cell: ({ row }) => {
      return row.original.created_by_user.name;
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
      const order = row.original;
      return (
        <ActionMenu
          onView={`/dashboard/orders/${order.id}`}
          onDelete={<FormDelete id={order.id} />}
        />
      );
    },
  },
];

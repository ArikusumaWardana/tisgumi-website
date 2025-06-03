"use client";

import { ActionMenu } from "@/components/ui/action-menu";
import { ColumnDef } from "@tanstack/react-table";
import { formatIndonesianDate } from "@/utils/date-utils";
import FormDelete from "./_components/form-delete";
import { StatusBadge } from "@/components/ui/status-badge";

// Type that matches the actual data structure from getCustomersPaginated
type CustomerData = {
  id: number;
  code: string;
  name: string;
  phone: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export const columns: ColumnDef<CustomerData>[] = [
  {
    header: "Code",
    accessorKey: "code",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Phone",
    accessorKey: "phone",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const customer = row.original;
      return <StatusBadge status={customer.status} />;
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
      const customer = row.original;
      return (
        <ActionMenu
          onContact={`https://wa.me/${customer.phone}`}
          onEdit={`/dashboard/customers/edit/${customer.id}`}
          onView={`/dashboard/customers/view/${customer.id}`}
          onDelete={<FormDelete id={customer.id} />}
        />
      );
    },
  },
];

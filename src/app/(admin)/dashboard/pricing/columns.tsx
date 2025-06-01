"use client";

import { ActionMenu } from "@/components/ui/action-menu";
import { Customer } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { formatIndonesianDate } from "@/utils/date-utils";
import { StatusBadge } from "@/components/ui/status-badge";

// Extended Customer type with custom pricing count
type CustomerWithPricing = Customer & {
  custom_pricing_count: number;
  custom_prices: any[];
};

export const columns: ColumnDef<CustomerWithPricing>[] = [
  {
    header: "Customer Code",
    accessorKey: "code",
  },
  {
    header: "Customer Name",
    accessorKey: "name",
  },
  {
    header: "Phone",
    accessorKey: "phone",
  },
  {
    header: "Custom Products",
    accessorKey: "custom_pricing_count",
    cell: ({ row }) => {
      const count = row.original.custom_pricing_count;
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
          {count} Product{count !== 1 ? "s" : ""}
        </span>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      return <StatusBadge status={status} />;
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
          onView={`/dashboard/pricing/customer/${customer.id}`}
        />
      );
    },
  },
];

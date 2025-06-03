"use client";

import { ActionMenu } from "@/components/ui/action-menu";
import { ColumnDef } from "@tanstack/react-table";
import { formatIndonesianDate } from "@/utils/date-utils";
import FormDelete from "./_components/form-delete";
import { StatusBadge } from "@/components/ui/status-badge";

// Type that matches the actual data structure from getAdminsPaginated
type AdminData = {
  id: number;
  code: string;
  name: string;
  email: string;
  role: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export const columns: ColumnDef<AdminData>[] = [
  {
    header: "Code",
    accessorKey: "code",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Role",
    accessorKey: "role",
    cell: ({ row }) => {
      const admin = row.original;
      return <StatusBadge status={admin.role} />;
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
      const admin = row.original;
      return (
        <ActionMenu
          onEdit={`/dashboard/admins/edit/${admin.id}`}
          onDelete={<FormDelete id={admin.id} />}
        />
      );
    },
  },
];

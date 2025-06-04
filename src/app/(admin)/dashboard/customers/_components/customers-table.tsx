"use client";

import { DataTable } from "@/components/ui/data-table";
import { createCustomerColumns } from "../columns";
import { User } from "lucia";

interface Customer {
  id: number;
  code: string;
  name: string;
  phone: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

interface CustomersTableProps {
  data: Customer[];
  user: User | null;
}

export function CustomersTable({ data, user }: CustomersTableProps) {
  const columns = createCustomerColumns(user);
  return <DataTable columns={columns} data={data} />;
}

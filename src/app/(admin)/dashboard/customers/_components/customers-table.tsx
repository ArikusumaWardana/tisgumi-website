"use client";

import { DataTable } from "@/components/ui/data-table";
import { createCustomerColumns } from "../columns";
import { User } from "lucia";
import { Customer } from "../lib/types";

interface CustomersTableProps {
  data: Customer[];
  user: User | null;
}

export function CustomersTable({ data, user }: CustomersTableProps) {
  const columns = createCustomerColumns(user);
  return <DataTable columns={columns} data={data} />;
}

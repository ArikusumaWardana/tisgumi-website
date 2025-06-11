"use client";

import { DataTable } from "@/components/ui/data-table";
import { createProductColumns } from "../columns";
import { User } from "lucia";
import { ProductWithCategory } from "../lib/types";

interface ProductsTableProps {
  data: ProductWithCategory[];
  user: User | null;
}

export function ProductsTable({ data, user }: ProductsTableProps) {
  const columns = createProductColumns(user);
  return <DataTable columns={columns} data={data} />;
}

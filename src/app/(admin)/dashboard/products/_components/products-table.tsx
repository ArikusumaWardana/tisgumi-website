"use client";

import { DataTable } from "@/components/ui/data-table";
import { createProductColumns } from "../columns";
import { User } from "lucia";

interface Product {
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
}

interface ProductsTableProps {
  data: Product[];
  user: User | null;
}

export function ProductsTable({ data, user }: ProductsTableProps) {
  const columns = createProductColumns(user);
  return <DataTable columns={columns} data={data} />;
}

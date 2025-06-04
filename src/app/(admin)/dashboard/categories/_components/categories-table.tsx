"use client";

import { DataTable } from "@/components/ui/data-table";
import { createCategoryColumns } from "../columns";
import { User } from "lucia";

interface Category {
  id: number;
  code: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

interface CategoriesTableProps {
  data: Category[];
  user: User | null;
}

export function CategoriesTable({ data, user }: CategoriesTableProps) {
  const columns = createCategoryColumns(user);
  return <DataTable columns={columns} data={data} />;
}

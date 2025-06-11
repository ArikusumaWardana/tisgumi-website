"use client";

import { DataTable } from "@/components/ui/data-table";
import { createCategoryColumns } from "../columns";
import { User } from "lucia";
import { Category } from "../lib/types";

interface CategoriesTableProps {
  data: Category[];
  user: User | null;
}

export function CategoriesTable({ data, user }: CategoriesTableProps) {
  const columns = createCategoryColumns(user);
  return <DataTable columns={columns} data={data} />;
}

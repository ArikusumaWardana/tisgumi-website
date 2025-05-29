"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  searchValue?: string;
}

export function DataTable<TData>({
  columns,
  data,
  searchPlaceholder,
  onSearch,
  searchValue,
}: DataTableProps<TData>) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
      {searchPlaceholder && onSearch && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="pl-8"
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column: any, index: number) => (
              <TableHead key={(column.accessorKey as string) || index}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row: any, index: number) => (
              <TableRow key={row.id || row.code || index}>
                {columns.map((column: any, colIndex: number) => (
                  <TableCell
                    key={`${row.id || index}-${
                      (column.accessorKey as string) || colIndex
                    }`}
                  >
                    {column.cell
                      ? column.cell({ row: { original: row } })
                      : column.accessorKey
                      ? row[column.accessorKey]
                      : ""}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

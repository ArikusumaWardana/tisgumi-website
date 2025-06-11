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
import { ColumnDef, HeaderContext, CellContext } from "@tanstack/react-table";

type DataTableColumn<TData> = ColumnDef<TData, unknown> & {
  accessorKey?: string;
};

interface DataTableProps<TData> {
  columns: Array<DataTableColumn<TData>>;
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
            {columns.map((column, index: number) => (
              <TableHead key={String(column.id || index)}>
                {typeof column.header === "function"
                  ? column.header({} as HeaderContext<TData, unknown>)
                  : column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex: number) => (
              <TableRow key={String(rowIndex)}>
                {columns.map((column, colIndex: number) => {
                  const value = column.accessorKey
                    ? (row as Record<string, unknown>)[column.accessorKey]
                    : undefined;

                  return (
                    <TableCell key={`${rowIndex}-${colIndex}`}>
                      {typeof column.cell === "function"
                        ? column.cell({ row: { original: row } } as CellContext<
                            TData,
                            unknown
                          >)
                        : value !== undefined
                        ? String(value)
                        : ""}
                    </TableCell>
                  );
                })}
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

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

interface DataTableProps {
  columns: {
    header: string;
    accessorKey: string;
    cell?: (row: any) => React.ReactNode;
  }[];
  data: any[];
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  searchValue?: string;
}

export function DataTable({
  columns,
  data,
  searchPlaceholder,
  onSearch,
  searchValue,
}: DataTableProps) {
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
            {columns.map((column) => (
              <TableHead key={column.accessorKey}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.accessorKey}>
                  {column.cell ? column.cell(row) : row[column.accessorKey]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

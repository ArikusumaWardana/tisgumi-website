"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { columns } from "../columns";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

// Type that matches the actual data structure from getProductsPaginated
type ProductData = {
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
};

interface ProductsTableClientProps {
  data: ProductData[];
  pagination: PaginationInfo;
  search: string;
}

export function ProductsTableClient({
  data,
  pagination,
  search,
}: ProductsTableClientProps) {
  const router = useRouter();
  const { setPage, setLimit } = usePagination({ defaultLimit: 10 });
  const [searchValue, setSearchValue] = useState(search);

  // Debounced search to avoid too many requests
  const debouncedSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams();
    if (value) {
      params.set("search", value);
    }
    params.set("page", "1"); // Reset to first page on search

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : "";
    router.replace(newUrl);
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Data table */}
      <DataTable columns={columns} data={data} />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      )}
    </div>
  );
}

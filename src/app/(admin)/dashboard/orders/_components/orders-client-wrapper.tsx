"use client";

import DateRangeFilter from "./date-range-filter";
import { OrdersSearchForm } from "./orders-search-form";

interface OrdersClientWrapperProps {
  search: string;
}

export default function OrdersClientWrapper({
  search,
}: OrdersClientWrapperProps) {
  return (
    <div className="space-y-4">
      {/* Date Range Filter */}
      <DateRangeFilter />

      {/* Search bar with button and loading */}
      <OrdersSearchForm placeholder="Search orders..." defaultValue={search} />
    </div>
  );
}

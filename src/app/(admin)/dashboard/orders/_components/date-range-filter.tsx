"use client";

import { useState, useEffect } from "react";
import { Calendar, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";

interface DateRangeFilterProps {
  onFilter?: (startDate: string, endDate: string) => void;
}

export default function DateRangeFilter({ onFilter }: DateRangeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || ""
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  // Update state when URL params change
  useEffect(() => {
    setStartDate(searchParams.get("startDate") || "");
    setEndDate(searchParams.get("endDate") || "");
  }, [searchParams]);

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams);

    // Remove existing date params
    params.delete("startDate");
    params.delete("endDate");
    params.delete("page"); // Reset to first page when filtering

    // Add new date params if they exist
    if (startDate) {
      params.set("startDate", startDate);
    }
    if (endDate) {
      params.set("endDate", endDate);
    }

    // Navigate with new params
    router.push(`?${params.toString()}`);

    // Call onFilter callback if provided
    if (onFilter) {
      onFilter(startDate, endDate);
    }
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");

    const params = new URLSearchParams(searchParams);
    params.delete("startDate");
    params.delete("endDate");
    params.delete("page"); // Reset to first page when clearing

    router.push(`?${params.toString()}`);

    if (onFilter) {
      onFilter("", "");
    }
  };

  const hasDateFilter = startDate || endDate;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-500" />
        <Label className="text-sm font-medium">Filter by Date Range</Label>
        {hasDateFilter && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="ml-auto h-6 px-2 text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Start Date */}
        <div className="space-y-1">
          <Label
            htmlFor="startDate"
            className="text-xs text-gray-600 dark:text-gray-400"
          >
            Start Date
          </Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-sm"
          />
        </div>

        {/* End Date */}
        <div className="space-y-1">
          <Label
            htmlFor="endDate"
            className="text-xs text-gray-600 dark:text-gray-400"
          >
            End Date
          </Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-sm"
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button onClick={handleFilter} className="w-full" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Date Range Info */}
      {hasDateFilter && (
        <div className="text-xs text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded border">
          <span className="font-medium">Active Filter:</span>
          {startDate && endDate && (
            <span>
              {" "}
              {startDate} to {endDate}
            </span>
          )}
          {startDate && !endDate && <span> From {startDate} onwards</span>}
          {!startDate && endDate && <span> Up to {endDate}</span>}
        </div>
      )}
    </div>
  );
}

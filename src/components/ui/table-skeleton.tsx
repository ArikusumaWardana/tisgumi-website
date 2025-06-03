import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  title?: string;
  rows?: number;
  columns?: number;
}

export function TableSkeleton({
  rows = 10,
  columns = 7,
}: TableSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Page Header Skeleton */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="space-y-4">
        {/* Search Bar Skeleton */}
        <div className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Table Skeleton */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="flex-1 px-2">
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>

          {/* Table Rows */}
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className={`flex border-b border-gray-100 dark:border-gray-700 p-4 last:border-b-0 ${
                i % 2 === 0
                  ? "bg-white dark:bg-gray-900"
                  : "bg-gray-50 dark:bg-gray-850"
              }`}
            >
              {Array.from({ length: columns }).map((_, j) => (
                <div key={j} className="flex-1 px-2">
                  <Skeleton
                    className={`h-4 ${
                      j === 0
                        ? "w-24"
                        : j === 1
                        ? "w-32"
                        : j === columns - 1
                        ? "w-16"
                        : "w-20"
                    }`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between pt-4">
          <Skeleton className="h-4 w-52" />
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

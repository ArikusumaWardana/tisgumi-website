export function OrdersTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search and filters skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="w-full sm:w-48">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="border rounded-lg overflow-hidden">
        {/* Table header */}
        <div className="bg-gray-50 dark:bg-gray-800 border-b">
          <div className="grid grid-cols-9 gap-4 p-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Table rows */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="border-b last:border-b-0">
            <div className="grid grid-cols-9 gap-4 p-4">
              {/* Order Code */}
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

              {/* Customer */}
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
              </div>

              {/* Total Items */}
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>

              {/* Total Amount */}
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>

              {/* Status */}
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-20"></div>

              {/* Created By */}
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

              {/* Created At */}
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

              {/* WhatsApp */}
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-8"></div>

              {/* Actions */}
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-8"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
        </div>
      </div>
    </div>
  );
}

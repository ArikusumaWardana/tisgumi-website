import React from "react";

interface FormLoadingProps {
  loadingProgress: string;
  title?: string;
  description?: string;
}

export default function FormLoading({
  loadingProgress,
  title = "Preparing Form",
  description = "Loading required data...",
}: FormLoadingProps) {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-80"></div>
        </div>
      </div>

      {/* Form Container Skeleton */}
      <div className="max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-6">
          {/* Form Title Skeleton */}
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>

          {/* Form Fields Skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field 1 */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
            </div>

            {/* Field 2 */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-28"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-36"></div>
            </div>

            {/* Field 3 */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-28"></div>
            </div>

            {/* Field 4 */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-40"></div>
            </div>
          </div>

          {/* Additional Fields for Complex Forms */}
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-40"></div>
            <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
              </div>
            </div>
          </div>

          {/* Total Section Skeleton (for pricing/orders) */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="h-5 bg-blue-200 dark:bg-blue-700 rounded animate-pulse w-24"></div>
              <div className="h-6 bg-blue-200 dark:bg-blue-700 rounded animate-pulse w-32"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-28"></div>
        </div>

        {/* Loading Status */}
        <div className="flex items-center justify-center py-6">
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div className="text-center">
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs">{description}</p>
              <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
                {loadingProgress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

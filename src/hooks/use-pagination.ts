"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

interface UsePaginationProps {
  defaultPage?: number;
  defaultLimit?: number;
}

export function usePagination({
  defaultPage = 1,
  defaultLimit = 10,
}: UsePaginationProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current values from URL
  const page = Number(searchParams.get("page")) || defaultPage;
  const limit = Number(searchParams.get("limit")) || defaultLimit;

  // Update URL with new pagination values
  const updateUrl = useCallback(
    (updates: { page?: number; limit?: number }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (updates.page !== undefined) {
        if (updates.page <= 1) {
          params.delete("page");
        } else {
          params.set("page", updates.page.toString());
        }
      }

      if (updates.limit !== undefined) {
        if (updates.limit === defaultLimit) {
          params.delete("limit");
        } else {
          params.set("limit", updates.limit.toString());
        }
      }

      const queryString = params.toString();
      const newUrl = queryString ? `?${queryString}` : "";

      router.replace(newUrl, { scroll: false });
    },
    [router, searchParams, defaultLimit]
  );

  // Handlers
  const setPage = useCallback(
    (newPage: number) => {
      updateUrl({ page: newPage });
    },
    [updateUrl]
  );

  const setLimit = useCallback(
    (newLimit: number) => {
      // Reset to page 1 when changing limit
      updateUrl({ page: 1, limit: newLimit });
    },
    [updateUrl]
  );

  // Prisma skip/take values
  const skip = useMemo(() => (page - 1) * limit, [page, limit]);
  const take = limit;

  return {
    page,
    limit,
    skip,
    take,
    setPage,
    setLimit,
  };
}

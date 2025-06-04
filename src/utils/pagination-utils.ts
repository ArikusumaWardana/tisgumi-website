import { PaginationInfo } from "@/components/ui/pagination";

// Default pagination settings
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// Standard pagination parameters interface
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Standard pagination result interface
export interface PaginationResult<T> {
  data: T[];
  pagination: PaginationInfo;
}

// Helper function to create pagination info
export function createPaginationInfo(
  page: number,
  limit: number,
  total: number
): PaginationInfo {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

// Helper function to calculate skip value for Prisma
export function calculateSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

// Helper function to build search where clause
export function buildSearchWhere(
  search: string | undefined,
  searchFields: string[]
): Record<string, any> {
  if (!search) return {};

  const searchConditions = searchFields.map((field) => {
    // Handle nested fields (e.g., "customer.name")
    if (field.includes(".")) {
      const [relation, relationField] = field.split(".");
      return {
        [relation as string]: {
          [relationField as string]: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      };
    }

    // Handle direct fields
    return {
      [field as string]: {
        contains: search,
        mode: "insensitive" as const,
      },
    };
  });

  return {
    OR: searchConditions,
  };
}

// Standard error response for pagination
export function createPaginationError<T>(): PaginationResult<T> {
  return {
    data: [],
    pagination: {
      page: 1,
      limit: DEFAULT_PAGE_SIZE,
      total: 0,
      totalPages: 0,
    },
  };
}

// Helper function to validate pagination parameters
export function validatePaginationParams(params: PaginationParams) {
  const page = Math.max(1, params.page || DEFAULT_PAGE);
  const limit = Math.min(100, Math.max(1, params.limit || DEFAULT_PAGE_SIZE)); // Max 100 items per page
  const search = params.search?.trim() || "";

  return { page, limit, search };
}
 
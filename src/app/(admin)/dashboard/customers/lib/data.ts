import prisma from "../../../../../../lib/prisma";
import { PaginationInfo } from "@/components/ui/pagination";
import { Customer } from "./types";

interface GetCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface GetCustomersResult {
  data: Customer[];
  pagination: PaginationInfo;
}

// Function to get paginated customers
export async function getCustomersPaginated({
  page = 1,
  limit = 10,
  search,
}: GetCustomersParams = {}): Promise<GetCustomersResult> {
  try {
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      deleted_at: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { code: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    // Execute queries in parallel for better performance
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: customers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  }
}

// Function to get single customer by ID (optimized)
export async function getCustomerById(id: string) {
  try {
    const customer = await prisma.customer.findFirst({
      where: {
        id: Number.parseInt(id),
        deleted_at: null,
      },
    });

    return customer;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
}

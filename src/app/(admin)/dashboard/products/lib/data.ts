import prisma from "../../../../../../lib/prisma";
import { PaginationInfo } from "@/components/ui/pagination";
import { ProductWithCategory } from "./types";

interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface GetProductsResult {
  data: ProductWithCategory[];
  pagination: PaginationInfo;
}

// Function to get paginated products
export async function getProductsPaginated({
  page = 1,
  limit = 10,
  search,
}: GetProductsParams = {}): Promise<GetProductsResult> {
  try {
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      deleted_at: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { code: { contains: search, mode: "insensitive" as const } },
          {
            category: {
              name: { contains: search, mode: "insensitive" as const },
            },
          },
        ],
      }),
    };

    // Execute queries in parallel for better performance
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
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

// Function to get single product by ID (optimized)
export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: Number.parseInt(id),
        deleted_at: null,
      },
      include: {
        category: true,
      },
    });

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

import prisma from "../../../../../../lib/prisma";
import { PaginationInfo } from "@/components/ui/pagination";
import { Category } from "./types";

interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface GetCategoriesResult {
  data: Category[];
  pagination: PaginationInfo;
}

// Function to get all categories (backward compatibility)
export async function getCategories() {
  try {
    // Get all categories from the database
    const categories = await prisma.categories.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    // Return the categories
    return categories;
  } catch (error) {
    // If there is an error, return an empty array
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Function to get paginated categories
export async function getCategoriesPaginated({
  page = 1,
  limit = 10,
  search,
}: GetCategoriesParams = {}): Promise<GetCategoriesResult> {
  try {
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      deleted_at: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { code: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    // Execute queries in parallel for better performance
    const [categories, total] = await Promise.all([
      prisma.categories.findMany({
        where,
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.categories.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
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

// Function to get single category by ID (optimized)
export async function getCategoryById(id: string) {
  try {
    // Validate that id is a valid integer
    const numericId = Number.parseInt(id);
    if (isNaN(numericId) || numericId <= 0) {
      return null;
    }

    const category = await prisma.categories.findFirst({
      where: {
        id: numericId,
        deleted_at: null,
      },
    });

    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

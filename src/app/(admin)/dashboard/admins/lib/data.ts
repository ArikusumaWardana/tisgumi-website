import prisma from "../../../../../../lib/prisma";
import { getUser } from "@/lib/auth";
import { PaginationInfo } from "@/components/ui/pagination";
import { Role } from "@prisma/client";

interface GetAdminsParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface GetAdminsResult {
  data: Array<{
    id: number;
    code: string;
    name: string;
    email: string;
    role: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  }>;
  pagination: PaginationInfo;
}

// Function to get paginated admins
export async function getAdminsPaginated({
  page = 1,
  limit = 10,
  search,
}: GetAdminsParams = {}): Promise<GetAdminsResult> {
  try {
    // Check user role for access control
    const { user } = await getUser();

    // If user is not superadmin, return empty result
    if (!user || user.role !== "superadmin") {
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

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      deleted_at: null,
      role: Role.admin,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { code: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    // Execute queries in parallel for better performance
    const [admins, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: admins,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching admins:", error);
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

// Function to get a admin by id
export async function getAdminById(id: string) {
  try {
    // Check user role for access control
    const { user } = await getUser();

    // If user is not superadmin, return null
    if (!user || user.role !== "superadmin") {
      return null;
    }

    // Get the admin by id
    const admin = await prisma.user.findFirst({
      where: {
        id: Number.parseInt(id),
        deleted_at: null,
      },
    });
    // Return the admin
    return admin;
  } catch (error) {
    // If there is an error, return null
    console.error("Error fetching admin:", error);
    return null;
  }
}

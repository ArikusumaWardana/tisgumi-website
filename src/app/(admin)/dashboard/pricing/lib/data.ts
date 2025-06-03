import prisma from "../../../../../../lib/prisma";
import { PaginationInfo } from "@/components/ui/pagination";

interface GetCustomersWithPricingParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface GetCustomersWithPricingResult {
  data: Array<{
    id: number;
    code: string;
    name: string;
    phone: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    custom_prices: Array<any>;
    custom_pricing_count: number;
  }>;
  pagination: PaginationInfo;
}

// Function to get all customers who have custom product pricings (backward compatibility)
export async function getCustomersWithPricing() {
  try {
    // Get customers who have custom product pricings
    const customers = await prisma.customer.findMany({
      where: {
        deleted_at: null,
        custom_prices: {
          some: {
            deleted_at: null,
          },
        },
      },
      include: {
        custom_prices: {
          where: {
            deleted_at: null,
          },
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
    // Return the customers with custom pricing count
    return customers.map((customer) => ({
      ...customer,
      custom_pricing_count: customer.custom_prices.length,
    }));
  } catch (error) {
    // If there is an error, return an empty array
    console.error("Error fetching customers with custom pricing:", error);
    return [];
  }
}

// Function to get paginated customers with pricing
export async function getCustomersWithPricingPaginated({
  page = 1,
  limit = 10,
  search,
}: GetCustomersWithPricingParams = {}): Promise<GetCustomersWithPricingResult> {
  try {
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      deleted_at: null,
      custom_prices: {
        some: {
          deleted_at: null,
        },
      },
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
        include: {
          custom_prices: {
            where: {
              deleted_at: null,
            },
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Add custom pricing count
    const customersWithCount = customers.map((customer) => ({
      ...customer,
      custom_pricing_count: customer.custom_prices.length,
    }));

    return {
      data: customersWithCount,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching customers with custom pricing:", error);
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

// Function to get customer pricing details by customer id
export async function getCustomerPricingDetails(customerId: string) {
  try {
    // Get customer with all custom pricing details
    const customer = await prisma.customer.findFirst({
      where: {
        id: Number.parseInt(customerId),
        deleted_at: null,
      },
      include: {
        custom_prices: {
          where: {
            deleted_at: null,
          },
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });
    // Return the customer with pricing details
    return customer;
  } catch (error) {
    // If there is an error, return null
    console.error("Error fetching customer pricing details:", error);
    return null;
  }
}

// Function to get all custom product pricings (keep for backward compatibility)
export async function getCustomProductPricings() {
  try {
    // Get all custom product pricings from the database
    const customProductPricings = await prisma.customProductPricing.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        customer: true,
        product: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    // Return the custom product pricings
    return customProductPricings;
  } catch (error) {
    // If there is an error, return an empty array
    console.error("Error fetching custom product pricings:", error);
    return [];
  }
}

// Function to get a custom product pricing by id
export async function getCustomProductPricingById(id: string) {
  try {
    // Get the custom product pricing by id
    const customProductPricing = await prisma.customProductPricing.findFirst({
      where: {
        id: Number.parseInt(id),
        deleted_at: null,
      },
      include: {
        customer: true,
        product: true,
      },
    });
    // Return the custom product pricing
    return customProductPricing;
  } catch (error) {
    // If there is an error, return null
    console.error("Error fetching custom product pricing:", error);
    return null;
  }
}

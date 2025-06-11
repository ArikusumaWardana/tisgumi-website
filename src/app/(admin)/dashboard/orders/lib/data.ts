import prisma from "../../../../../../lib/prisma";
import { PaginationInfo } from "@/components/ui/pagination";
import { measureAsync } from "@/utils/performance";

interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

interface OrderWithTotals {
  id: number;
  code: string;
  customer_id: number;
  created_by_user_id: number;
  status: string;
  payment_date: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  customer: {
    id: number;
    code: string;
    name: string;
    phone: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  };
  created_by_user: {
    id: number;
    name: string;
    code: string;
  };
  order_items: Array<{
    id: number;
    code: string;
    order_id: number;
    product_id: number;
    quantity: number;
    price_at_time: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    product: {
      id: number;
      code: string;
      name: string;
      default_price: number;
      status: string;
      category_id: number;
      created_at: Date;
      updated_at: Date;
      deleted_at: Date | null;
      category: {
        id: number;
        code: string;
        name: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
      };
    };
  }>;
  _count: {
    invoices: number;
  };
  total_amount: number;
  total_items: number;
}

interface GetOrdersResult {
  data: OrderWithTotals[];
  pagination: PaginationInfo;
}

// Function to get paginated orders with optimized aggregation
export async function getOrdersPaginated({
  page = 1,
  limit = 10,
  search,
  startDate,
  endDate,
}: GetOrdersParams = {}): Promise<GetOrdersResult> {
  return measureAsync(
    "getOrdersPaginated",
    async () => {
      try {
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {
          deleted_at: null,
          ...(search && {
            OR: [
              { code: { contains: search, mode: "insensitive" as const } },
              {
                customer: {
                  name: { contains: search, mode: "insensitive" as const },
                },
              },
              {
                customer: {
                  code: { contains: search, mode: "insensitive" as const },
                },
              },
            ],
          }),
        };

        // Add date filtering
        if (startDate || endDate) {
          where.created_at = {};
          if (startDate) {
            where.created_at.gte = new Date(startDate);
          }
          if (endDate) {
            // Add time to end of day for endDate
            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);
            where.created_at.lte = endOfDay;
          }
        }

        // Get orders and total count in parallel
        const [orders, total] = await Promise.all([
          prisma.order.findMany({
            where,
            include: {
              customer: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                  phone: true,
                  status: true,
                  created_at: true,
                  updated_at: true,
                  deleted_at: true,
                },
              },
              created_by_user: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
              order_items: {
                select: {
                  id: true,
                  code: true,
                  order_id: true,
                  product_id: true,
                  quantity: true,
                  price_at_time: true,
                  created_at: true,
                  updated_at: true,
                  deleted_at: true,
                  product: {
                    select: {
                      id: true,
                      code: true,
                      name: true,
                      default_price: true,
                      status: true,
                      category_id: true,
                      created_at: true,
                      updated_at: true,
                      deleted_at: true,
                      // Only include category for order_items that need it
                      category: {
                        select: {
                          id: true,
                          code: true,
                          name: true,
                          created_at: true,
                          updated_at: true,
                          deleted_at: true,
                        },
                      },
                    },
                  },
                },
              },
              // Only include invoices when really needed - for now removing from table view
              _count: {
                select: {
                  invoices: true,
                },
              },
            },
            orderBy: {
              created_at: "desc",
            },
            skip,
            take: limit,
          }),
          prisma.order.count({ where }),
        ]);

        // Calculate totals for each order
        const ordersWithTotals: OrderWithTotals[] = orders.map((order) => ({
          ...order,
          total_amount: order.order_items.reduce(
            (sum, item) => sum + item.price_at_time * item.quantity,
            0
          ),
          total_items: order.order_items.reduce(
            (sum, item) => sum + item.quantity,
            0
          ),
        }));

        const totalPages = Math.ceil(total / limit);

        return {
          data: ordersWithTotals,
          pagination: {
            page,
            limit,
            total,
            totalPages,
          },
        };
      } catch (error) {
        console.error("Error fetching orders:", error);
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
    },
    { page, limit, search: !!search, dateFilter: !!(startDate || endDate) }
  );
}

// Function to get order by id with full details (optimized)
export async function getOrderById(id: string) {
  try {
    // Validate that id is a valid integer
    const numericId = Number.parseInt(id);
    if (isNaN(numericId) || numericId <= 0) {
      return null;
    }

    const order = await prisma.order.findFirst({
      where: {
        id: numericId,
        deleted_at: null,
      },
      include: {
        customer: {
          select: {
            id: true,
            code: true,
            name: true,
            phone: true,
            status: true,
            created_at: true,
            updated_at: true,
            deleted_at: true,
          },
        },
        created_by_user: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        order_items: {
          where: {
            deleted_at: null,
          },
          select: {
            id: true,
            code: true,
            order_id: true,
            product_id: true,
            quantity: true,
            price_at_time: true,
            created_at: true,
            updated_at: true,
            deleted_at: true,
            product: {
              select: {
                id: true,
                code: true,
                name: true,
                default_price: true,
                status: true,
                category_id: true,
                created_at: true,
                updated_at: true,
                deleted_at: true,
                category: {
                  select: {
                    id: true,
                    code: true,
                    name: true,
                    created_at: true,
                    updated_at: true,
                    deleted_at: true,
                  },
                },
              },
            },
          },
        },
        invoices: {
          select: {
            id: true,
            order_id: true,
            file_url: true,
            show_price: true,
            created_at: true,
          },
        },
      },
    });

    if (!order) return null;

    // Calculate totals
    const total_amount = order.order_items.reduce(
      (sum, item) => sum + item.price_at_time * item.quantity,
      0
    );
    const total_items = order.order_items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    return {
      ...order,
      total_amount,
      total_items,
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

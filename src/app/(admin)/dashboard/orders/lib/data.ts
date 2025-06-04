import prisma from "../../../../../../lib/prisma";
import { PaginationInfo } from "@/components/ui/pagination";

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
  invoices: Array<{
    id: number;
    order_id: number;
    file_url: string;
    show_price: boolean;
    created_at: Date;
  }>;
  total_amount: number;
  total_items: number;
}

interface GetOrdersResult {
  data: OrderWithTotals[];
  pagination: PaginationInfo;
}

// Function to get all orders (backward compatibility)
export async function getOrders() {
  try {
    // Get all orders from the database with relations
    const orders = await prisma.order.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        customer: true,
        created_by_user: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        order_items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
        invoices: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Calculate total for each order
    return orders.map((order) => ({
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
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

// Function to get paginated orders with optimized aggregation
export async function getOrdersPaginated({
  page = 1,
  limit = 10,
  search,
  startDate,
  endDate,
}: GetOrdersParams = {}): Promise<GetOrdersResult> {
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
          customer: true,
          created_by_user: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          order_items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
          invoices: true,
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
}

// Function to get order by id with full details (optimized)
export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: Number.parseInt(id),
        deleted_at: null,
      },
      include: {
        customer: true,
        created_by_user: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        order_items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
        invoices: true,
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

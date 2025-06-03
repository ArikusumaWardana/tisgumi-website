import prisma from "../../../../../../lib/prisma";

// Function to get all orders
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

// Function to get order by id with full details
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

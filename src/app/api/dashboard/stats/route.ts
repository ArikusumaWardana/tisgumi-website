import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(_request: NextRequest) {
  try {
    // Get all orders for calculations
    const orders = await prisma.order.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        order_items: true,
      },
    });

    // Get all customers count
    const totalCustomers = await prisma.customer.count({
      where: {
        deleted_at: null,
      },
    });

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => {
      const orderTotal = order.order_items.reduce(
        (orderSum, item) => orderSum + item.price_at_time * item.quantity,
        0
      );
      return sum + orderTotal;
    }, 0);

    // Calculate average order value
    const averageOrderValue =
      orders.length > 0 ? totalRevenue / orders.length : 0;

    const stats = {
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers,
      averageOrderValue,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET() {
  try {
    // Get 4 most recent orders
    const orders = await prisma.order.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        customer: true,
        order_items: true,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 4,
    });

    // Format the orders data
    const formattedOrders = orders.map((order) => {
      const totalAmount = order.order_items.reduce(
        (sum, item) => sum + item.price_at_time * item.quantity,
        0
      );

      return {
        id: order.code,
        customer: order.customer.name,
        amount: totalAmount,
        status: order.payment_date ? "Lunas" : "Belum Lunas",
        date: order.created_at,
      };
    });

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent orders" },
      { status: 500 }
    );
  }
}

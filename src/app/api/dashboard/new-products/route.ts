import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET() {
  try {
    // Get 2 newest products
    const products = await prisma.product.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        category: true,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 2,
    });

    // Format the products data
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.default_price,
      category: product.category.name,
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching new products:", error);
    return NextResponse.json(
      { error: "Failed to fetch new products" },
      { status: 500 }
    );
  }
}

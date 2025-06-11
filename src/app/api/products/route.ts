import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { measureAsync } from "@/utils/performance";

export async function GET() {
  try {
    const products = await measureAsync(
      "api-products-get",
      async () => {
        return await prisma.product.findMany({
          where: {
            deleted_at: null,
            status: "active", // Only fetch active products for orders
          },
          select: {
            id: true,
            code: true,
            name: true,
            default_price: true,
          },
          orderBy: {
            name: "asc",
          },
        });
      },
      { endpoint: "/api/products" }
    );

    const response = NextResponse.json(products);

    // Add caching headers (cache for 5 minutes)
    response.headers.set(
      "Cache-Control",
      "public, max-age=300, stale-while-revalidate=60"
    );
    response.headers.set("X-Total-Count", products.length.toString());

    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

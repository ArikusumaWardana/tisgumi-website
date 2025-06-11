import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { measureAsync } from "@/utils/performance";

export async function GET() {
  try {
    const customers = await measureAsync(
      "api-customers-get",
      async () => {
        return await prisma.customer.findMany({
          where: {
            deleted_at: null,
            status: "active", // Only fetch active customers for orders
          },
          select: {
            id: true,
            code: true,
            name: true,
          },
          orderBy: {
            name: "asc",
          },
        });
      },
      { endpoint: "/api/customers" }
    );

    const response = NextResponse.json(customers);

    // Add caching headers (cache for 5 minutes)
    response.headers.set(
      "Cache-Control",
      "public, max-age=300, stale-while-revalidate=60"
    );
    response.headers.set("X-Total-Count", customers.length.toString());

    return response;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

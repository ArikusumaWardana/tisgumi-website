import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(_request: NextRequest) {
  try {
    const latestOrder = await prisma.order.findFirst({
      orderBy: {
        created_at: "desc",
      },
      select: {
        code: true,
      },
    });

    let orderCode = "ORD-001";

    if (latestOrder) {
      // Extract number from latest code and increment
      const codeNumber = parseInt(latestOrder.code.split("-")[1] || "0") + 1;
      orderCode = `ORD-${codeNumber.toString().padStart(3, "0")}`;
    }

    return NextResponse.json({ orderCode });
  } catch (error) {
    console.error("Error generating order code:", error);
    // Return fallback code based on timestamp
    const fallbackCode = `ORD-${Date.now().toString().slice(-6)}`;
    return NextResponse.json({ orderCode: fallbackCode });
  }
}

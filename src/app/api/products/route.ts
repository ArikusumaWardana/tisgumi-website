import { NextResponse } from "next/server";
import { getProductsForSelect } from "../../(admin)/dashboard/products/lib/actions";

export async function GET() {
  try {
    const products = await getProductsForSelect();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error in products API route:", error);
    return NextResponse.json([], { status: 500 });
  }
}

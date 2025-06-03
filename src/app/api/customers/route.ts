import { NextResponse } from "next/server";
import { getCustomersForSelect } from "../../(admin)/dashboard/customers/lib/actions";

export async function GET() {
  try {
    const customers = await getCustomersForSelect();
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error in customers API route:", error);
    return NextResponse.json([], { status: 500 });
  }
}

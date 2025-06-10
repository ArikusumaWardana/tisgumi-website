import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import prisma from "../../../../../lib/prisma";

// Force no cache for this API route
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = {
  filename: string;
};

interface Context {
  params: Promise<Params>;
}

export async function GET(_request: NextRequest, { params }: Context) {
  try {
    // Await params before using its properties
    const resolvedParams = await params;
    const { filename } = resolvedParams;

    // Validate filename format
    if (!filename || !filename.endsWith(".pdf")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    // Check if invoice exists in database
    const invoice = await prisma.invoice.findFirst({
      where: {
        file_url: {
          contains: filename,
        },
      },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Get file from Supabase storage
    const { data: fileData, error } = await supabase.storage
      .from("invoices")
      .download(filename);

    if (error || !fileData) {
      console.error("Error downloading file:", error);
      return NextResponse.json(
        { error: "File not found in storage" },
        { status: 404 }
      );
    }

    // Convert blob to array buffer
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create response with proper headers
    const response = new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
        "Content-Length": buffer.length.toString(),
        // Security headers
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    });

    return response;
  } catch (error) {
    console.error("Error serving invoice:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoiceTemplate } from "@/components/pdf/invoice-template";
import { supabase } from "@/lib/supabase";
import prisma from "../../../../../../lib/prisma";
import React from "react";

// Types
type Tparams = {
  id: string;
};

interface Context {
  params: Promise<Tparams>;
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    console.log("PDF generation started");

    // Await params before using its properties
    const resolvedParams = await params;
    const orderId = parseInt(resolvedParams.id);

    // Parse request body
    const { showPrices } = await request.json();
    console.log(
      "Generating PDF for order:",
      orderId,
      "showPrices:",
      showPrices
    );

    // Get order data with all relations
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
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
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("Order found:", order.code);

    // Calculate totals
    const total_amount = order.order_items.reduce(
      (sum, item) => sum + item.price_at_time * item.quantity,
      0
    );
    const total_items = order.order_items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    // Prepare order data for PDF
    const orderData = {
      ...order,
      total_amount,
      total_items,
      created_at: order.created_at.toISOString(),
    };

    console.log("Generating PDF buffer...");

    // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(
      <InvoiceTemplate orderData={orderData} showPrices={showPrices} />
    );

    console.log("PDF buffer generated, size:", pdfBuffer.length);

    // Generate filename
    const timestamp = new Date().toISOString().split("T")[0];
    const priceType = showPrices ? "with-prices" : "without-prices";
    const filename = `invoice-${order.code}-${priceType}-${timestamp}.pdf`;

    console.log("Uploading to Supabase:", filename);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("invoices")
      .upload(filename, pdfBuffer, {
        contentType: "application/pdf",
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        {
          error: "Failed to upload PDF to storage",
          details: uploadError.message,
        },
        { status: 500 }
      );
    }

    console.log("Upload successful:", uploadData);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("invoices")
      .getPublicUrl(filename);

    console.log("Public URL:", urlData.publicUrl);

    // Save invoice record to database
    const invoice = await prisma.invoice.create({
      data: {
        order_id: orderId,
        file_url: urlData.publicUrl,
        show_price: showPrices,
      },
    });

    console.log("Invoice record created:", invoice.id);

    return NextResponse.json({
      success: true,
      invoice,
      downloadUrl: urlData.publicUrl,
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

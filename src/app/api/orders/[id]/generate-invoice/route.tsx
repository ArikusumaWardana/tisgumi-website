import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoiceTemplate } from "@/components/pdf/invoice-template";
import { supabase } from "@/lib/supabase";
import prisma from "../../../../../../lib/prisma";
import React from "react";

// Force no cache for this API route
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Custom domain configuration for professional URLs
const CUSTOM_INVOICE_DOMAIN = process.env.CUSTOM_INVOICE_DOMAIN || null;

// Function to create professional invoice URL
function createProfessionalUrl(
  _supabaseUrl: string,
  filename: string,
  request: NextRequest
): string {
  if (CUSTOM_INVOICE_DOMAIN) {
    // Use custom domain: https://invoice.tisgumi.com/[filename]
    return `https://${CUSTOM_INVOICE_DOMAIN}/${filename}`;
  }

  // Use internal proxy API for professional looking URLs
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  return `${baseUrl}/api/invoice/${filename}`;
}

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
    console.log("Using InvoiceTemplate with Canvas logo (latest version)");

    // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(
      <InvoiceTemplate orderData={orderData} showPrices={showPrices} />
    );

    console.log("PDF buffer generated, size:", pdfBuffer.length);
    console.log("Template used: InvoiceTemplate with Canvas logo design");

    // Generate professional filename
    const timestamp = new Date().toISOString().split("T")[0];
    // Use shorter, cleaner filename format
    const filename = `tisgumi-invoice-${order.code}-${timestamp}.pdf`;

    console.log("Uploading to Supabase bucket 'invoices':", filename);
    console.log("PDF buffer size for upload:", pdfBuffer.length);

    // Check if bucket exists and is accessible
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError);
    } else {
      console.log(
        "Available buckets:",
        buckets.map((b) => b.name)
      );
    }

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
      console.error(
        "Upload error details:",
        JSON.stringify(uploadError, null, 2)
      );
      return NextResponse.json(
        {
          error: "Failed to upload PDF to storage",
          details: uploadError.message,
          bucketInfo: buckets?.map((b) => b.name) || "Unable to fetch buckets",
        },
        { status: 500 }
      );
    }

    console.log("Upload successful:", uploadData);
    console.log("Upload details:", JSON.stringify(uploadData, null, 2));

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("invoices")
      .getPublicUrl(filename);

    console.log("Original Supabase URL:", urlData.publicUrl);

    // Create professional URL
    const professionalUrl = createProfessionalUrl(
      urlData.publicUrl,
      filename,
      request
    );
    console.log("Professional URL:", professionalUrl);

    // Verify file exists by checking if we can list it
    const { data: fileList, error: listError } = await supabase.storage
      .from("invoices")
      .list("", { search: filename });

    if (listError) {
      console.error("Error verifying file upload:", listError);
    } else {
      console.log(
        "File verification - found files:",
        fileList?.map((f) => f.name)
      );
      const fileExists = fileList?.some((f) => f.name === filename);
      console.log("File exists in bucket:", fileExists);
    }

    // Save invoice record to database with professional URL
    const invoice = await prisma.invoice.create({
      data: {
        order_id: orderId,
        file_url: professionalUrl, // Use professional URL
        show_price: showPrices,
      },
    });

    console.log("Invoice record created:", invoice.id);

    return NextResponse.json({
      success: true,
      invoice,
      downloadUrl: professionalUrl, // Return professional URL
      originalUrl: urlData.publicUrl, // Keep original for debugging
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

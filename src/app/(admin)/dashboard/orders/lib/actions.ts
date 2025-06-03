"use server";

import { ActionResult } from "@/types";
import { redirect } from "next/navigation";
import prisma from "../../../../../../lib/prisma";
import { getUser } from "@/lib/auth";

// Function to generate next order code (server action)
export async function generateOrderCode() {
  try {
    const latestOrder = await prisma.order.findFirst({
      orderBy: {
        created_at: "desc",
      },
      select: {
        code: true,
      },
    });

    if (!latestOrder) {
      return "ORD-001";
    }

    // Extract number from latest code and increment
    const codeNumber = parseInt(latestOrder.code.split("-")[1] || "0") + 1;
    return `ORD-${codeNumber.toString().padStart(3, "0")}`;
  } catch (error) {
    console.error("Error generating order code:", error);
    return `ORD-${Date.now()}`;
  }
}

// Function to get price for a customer and product (server action)
export async function getCustomerProductPrice(
  customerId: number,
  productId: number
) {
  try {
    // First check if customer has custom pricing for this product
    const customPricing = await prisma.customProductPricing.findFirst({
      where: {
        customer_id: customerId,
        product_id: productId,
        deleted_at: null,
      },
    });

    if (customPricing) {
      return customPricing.custom_price;
    }

    // If no custom pricing, get default price from product
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        deleted_at: null,
      },
      select: {
        default_price: true,
      },
    });

    return product?.default_price || 0;
  } catch (error) {
    console.error("Error fetching customer product price:", error);
    return 0;
  }
}

// Function to auto-generate invoices
async function generateInvoices(orderId: number) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    console.log("Generating invoices for order:", orderId);

    // Generate invoice with prices
    const withPricesResponse = await fetch(
      `${baseUrl}/api/orders/${orderId}/generate-invoice`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ showPrices: true }),
      }
    );

    // Generate invoice without prices
    const withoutPricesResponse = await fetch(
      `${baseUrl}/api/orders/${orderId}/generate-invoice`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ showPrices: false }),
      }
    );

    if (!withPricesResponse.ok) {
      const errorText = await withPricesResponse.text();
      console.error("Failed to generate invoice with prices:", errorText);
    }

    if (!withoutPricesResponse.ok) {
      const errorText = await withoutPricesResponse.text();
      console.error("Failed to generate invoice without prices:", errorText);
    }

    return {
      withPrices: withPricesResponse.ok,
      withoutPrices: withoutPricesResponse.ok,
    };
  } catch (error) {
    console.error("Error generating invoices:", error);
    return { withPrices: false, withoutPrices: false };
  }
}

// Interface for order item input
interface OrderItemInput {
  product_id: number;
  quantity: number;
}

// Function to create new order
export async function createOrder(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Get current user from session
    const { user } = await getUser();

    if (!user) {
      return { error: "Authentication required" };
    }

    // Parse order items from form data
    const orderItems: OrderItemInput[] = [];
    let index = 0;

    while (formData.get(`order_items[${index}].product_id`)) {
      const productId = Number(
        formData.get(`order_items[${index}].product_id`)
      );
      const quantity = Number(formData.get(`order_items[${index}].quantity`));

      if (productId && quantity > 0) {
        orderItems.push({
          product_id: productId,
          quantity: quantity,
        });
      }
      index++;
    }

    const customerId = Number(formData.get("customer_id"));
    const orderCode = formData.get("code") as string;
    const paymentStatus = formData.get("payment_status") as string;

    // Validation
    if (!customerId) {
      return { error: "Customer is required" };
    }

    if (!orderCode) {
      return { error: "Order code is required" };
    }

    if (!paymentStatus || !["lunas", "belum_lunas"].includes(paymentStatus)) {
      return { error: "Valid payment status is required" };
    }

    if (orderItems.length === 0) {
      return { error: "At least one product item is required" };
    }

    // Check if order code already exists
    const existingOrder = await prisma.order.findFirst({
      where: {
        code: orderCode,
        deleted_at: null,
      },
    });

    if (existingOrder) {
      return { error: "Order code already exists" };
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create order with current user ID
      const order = await tx.order.create({
        data: {
          code: orderCode,
          customer_id: customerId,
          created_by_user_id: user.id, // Use user ID from session
          status: paymentStatus as "lunas" | "belum_lunas",
          payment_date: paymentStatus === "lunas" ? new Date() : null,
        },
      });

      // Create order items with custom pricing logic
      const orderItemsData = await Promise.all(
        orderItems.map(async (item, itemIndex) => {
          // Get price for this customer and product
          const priceAtTime = await getCustomerProductPrice(
            customerId,
            item.product_id
          );

          return {
            code: `${orderCode}-ITEM-${itemIndex + 1}`,
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_time: priceAtTime,
          };
        })
      );

      // Create all order items
      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      return order;
    });

    // Generate both invoices automatically (don't fail if this fails)
    try {
      await generateInvoices(result.id);
      console.log("Invoices generated successfully");
    } catch (invoiceError) {
      console.error(
        "Invoice generation failed, but order was created:",
        invoiceError
      );
      // Don't fail the entire process, just log the error
    }

    // After successful creation, redirect to order detail page
    redirect(`/dashboard/orders/${result.id}`);
  } catch (error) {
    // Check if this is a redirect error (which is normal behavior)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      // This is expected behavior, re-throw to allow redirect
      throw error;
    }

    console.log("Order creation error:", error);
    return {
      error: "Failed to create order",
    };
  }
}

// Function to update payment status
export async function updatePaymentStatus(
  orderId: number,
  newStatus: "lunas" | "belum_lunas"
): Promise<ActionResult> {
  try {
    // Validation
    if (!orderId) {
      return { error: "Order ID is required" };
    }

    if (!["lunas", "belum_lunas"].includes(newStatus)) {
      return { error: "Valid payment status is required" };
    }

    // Check if order exists
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: orderId,
        deleted_at: null,
      },
    });

    if (!existingOrder) {
      return { error: "Order not found" };
    }

    // Update order with new payment status
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: newStatus,
        payment_date: newStatus === "lunas" ? new Date() : null,
      },
    });

    return { error: "" }; // Success case
  } catch (error) {
    console.error("Error updating payment status:", error);
    return {
      error: "Failed to update payment status",
    };
  }
}

// Function to delete an order
export async function deleteOrder(
  _: unknown,
  _formData: FormData,
  id: number
): Promise<ActionResult> {
  try {
    await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to delete order",
    };
  }

  return redirect("/dashboard/orders");
}

"use server";

import {
  customProductPricingSchema,
  singleCustomProductPricingSchema,
} from "@/lib/schema";
import { ActionResult } from "@/types";
import { redirect } from "next/navigation";
import prisma from "../../../../../../lib/prisma";

// Function to get count of pricing codes for auto-generation
export async function getPricingCount() {
  try {
    // Get count of distinct pricing codes (excluding deleted ones)
    const count = await prisma.customProductPricing.groupBy({
      by: ["code"],
      where: {
        deleted_at: null,
      },
    });

    return count.length;
  } catch (error) {
    console.error("Error fetching pricing count:", error);
    return 0;
  }
}

// Function to get all customers for select options (excluding those with existing custom pricing)
export async function getCustomers() {
  try {
    // Get customer IDs that already have custom pricing
    const existingCustomerIds = await prisma.customProductPricing.findMany({
      where: {
        deleted_at: null,
      },
      select: {
        customer_id: true,
      },
      distinct: ["customer_id"],
    });

    const excludedIds = existingCustomerIds.map((item) => item.customer_id);

    const customers = await prisma.customer.findMany({
      where: {
        deleted_at: null,
        status: "active",
        id: {
          notIn: excludedIds,
        },
      },
      select: {
        id: true,
        code: true,
        name: true,
      },
      orderBy: {
        name: "asc", // Sort ascending A-Z
      },
    });
    return customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

// Function to get all products for select options
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        deleted_at: null,
        status: "active",
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
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Function to create new custom product pricings (multiple items)
export async function postCustomProductPricing(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Parse product items from form data
    const productItems = [];
    let index = 0;

    while (formData.get(`product_items[${index}].product_id`)) {
      const productId = Number(
        formData.get(`product_items[${index}].product_id`)
      );
      const customPrice = Number(
        formData.get(`product_items[${index}].custom_price`)
      );

      if (productId && customPrice >= 0) {
        productItems.push({
          product_id: productId,
          custom_price: customPrice,
        });
      }
      index++;
    }

    const validate = customProductPricingSchema.safeParse({
      code: formData.get("code"),
      customer_id: Number(formData.get("customer_id")),
      product_items: productItems,
    });

    if (!validate.success) {
      return {
        error: validate.error.errors[0]?.message ?? "Validation failed",
      };
    }

    // Check if the code already exists
    const existingCustomProductPricing =
      await prisma.customProductPricing.findFirst({
        where: {
          code: validate.data.code,
          deleted_at: null,
        },
      });

    if (existingCustomProductPricing) {
      return { error: "Code already exists" };
    }

    // Create multiple custom product pricings
    const createPromises = validate.data.product_items.map((item, index) =>
      prisma.customProductPricing.create({
        data: {
          code: `${validate.data.code}-${index + 1}`,
          customer_id: validate.data.customer_id,
          product_id: item.product_id,
          custom_price: item.custom_price,
        },
      })
    );

    await Promise.all(createPromises);
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to create custom product pricing",
    };
  }

  return redirect("/dashboard/pricing");
}

// Function to update a custom product pricing
export async function updateCustomProductPricing(
  _: unknown,
  formData: FormData,
  id: number | undefined
): Promise<ActionResult> {
  // For update mode, we use the first product item since update is for single pricing
  const validate = singleCustomProductPricingSchema.safeParse({
    code: formData.get("code"),
    customer_id: Number(formData.get("customer_id")),
    product_id: Number(formData.get("product_items[0].product_id")),
    custom_price: Number(formData.get("product_items[0].custom_price")),
  });

  // If the validation fails, return an error message
  if (!validate.success) {
    return { error: validate.error.errors[0]?.message ?? "Validation failed" };
  }

  // If the id is undefined, return an error message
  if (id === undefined) {
    return {
      error: "Custom product pricing not found",
    };
  }

  // Try to update the custom product pricing
  try {
    await prisma.customProductPricing.update({
      where: {
        id: id,
      },
      data: {
        code: validate.data.code,
        customer_id: validate.data.customer_id,
        product_id: validate.data.product_id,
        custom_price: validate.data.custom_price,
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to update custom product pricing",
    };
  }

  return redirect("/dashboard/pricing");
}

// Function to delete a custom product pricing
export async function deleteCustomProductPricing(
  _: unknown,
  _formData: FormData,
  id: number
): Promise<ActionResult> {
  // Try to delete the custom product pricing
  try {
    await prisma.customProductPricing.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to delete custom product pricing",
    };
  }

  return redirect(`/dashboard/pricing`);
}

// Function to update customer pricing (multiple products)
export async function updateCustomerPricing(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  try {
    const customerId = Number(formData.get("customer_data_id"));
    const pricingCode = formData.get("pricing_code") as string;

    // Parse pricing items from form data
    const pricingItems = [];
    let index = 0;

    while (formData.get(`product_items[${index}].product_id`)) {
      const productId = Number(
        formData.get(`product_items[${index}].product_id`)
      );
      const customPrice = Number(
        formData.get(`product_items[${index}].custom_price`)
      );
      const existingId = formData.get(`product_items[${index}].id`);

      if (productId && customPrice >= 0) {
        pricingItems.push({
          id: existingId ? Number(existingId) : null,
          product_id: productId,
          custom_price: customPrice,
        });
      }
      index++;
    }

    if (pricingItems.length === 0) {
      return { error: "At least one product item is required" };
    }

    // Get existing pricing records for this customer
    const existingPricings = await prisma.customProductPricing.findMany({
      where: {
        customer_id: customerId,
        deleted_at: null,
      },
    });

    // Separate items into updates and creates
    const updates = [];
    const creates = [];
    const existingIds = pricingItems
      .filter((item) => item.id)
      .map((item) => item.id);

    // First, delete records that are not in the current form
    const deletePromises = existingPricings
      .filter((existing) => !existingIds.includes(existing.id))
      .map((pricing) =>
        prisma.customProductPricing.delete({
          where: { id: pricing.id },
        })
      );

    // Execute deletions first
    await Promise.all(deletePromises);

    // Get all existing codes to avoid conflicts when creating new records
    const allExistingCodes = await prisma.customProductPricing.findMany({
      where: {
        code: {
          startsWith: pricingCode + "-",
        },
        deleted_at: null,
      },
      select: {
        code: true,
      },
    });

    const existingCodeNumbers = allExistingCodes
      .map((item) => {
        const parts = item.code.split("-");
        const lastPart = parts[parts.length - 1];
        return parseInt(lastPart || "0");
      })
      .filter((num) => num > 0);

    let nextCodeNumber =
      existingCodeNumbers.length > 0 ? Math.max(...existingCodeNumbers) + 1 : 1;

    // Process each pricing item
    for (const item of pricingItems) {
      if (item.id) {
        // Update existing record
        updates.push(
          prisma.customProductPricing.update({
            where: { id: item.id },
            data: {
              product_id: item.product_id,
              custom_price: item.custom_price,
              updated_at: new Date(),
            },
          })
        );
      } else {
        // Create new record with unique code
        creates.push(
          prisma.customProductPricing.create({
            data: {
              code: `${pricingCode}-${nextCodeNumber}`,
              customer_id: customerId,
              product_id: item.product_id,
              custom_price: item.custom_price,
            },
          })
        );
        nextCodeNumber++;
      }
    }

    // Execute updates and creates
    await Promise.all([...updates, ...creates]);
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to update customer pricing",
    };
  }

  const customerId = Number(formData.get("customer_data_id"));
  return redirect(`/dashboard/pricing/customer/${customerId}`);
}

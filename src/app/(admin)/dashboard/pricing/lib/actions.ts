"use server";

import { singleCustomProductPricingSchema } from "@/lib/schema";
import { ActionResult } from "@/types";
import { redirect } from "next/navigation";
import prisma from "../../../../../../lib/prisma";

interface PricingItem {
  id?: number | undefined;
  product_id: number;
  custom_price: number;
}

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

// Function to get all customers (including those with pricing) for update mode
export async function getAllCustomers() {
  try {
    const customers = await prisma.customer.findMany({
      where: {
        deleted_at: null,
        status: "active",
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
    console.error("Error fetching all customers:", error);
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

// Function to generate unique pricing codes
async function generateUniquePricingCodes(count: number): Promise<string[]> {
  const codes: string[] = [];

  // Find the highest existing PRC number
  const lastPricingCode = await prisma.customProductPricing.findFirst({
    where: {
      code: {
        startsWith: "PRC-",
      },
      deleted_at: null,
    },
    orderBy: {
      code: "desc",
    },
    select: {
      code: true,
    },
  });

  let startNumber = 1;
  if (lastPricingCode) {
    // Extract number from code like "PRC-001" -> get the number after PRC-
    const codeMatch = lastPricingCode.code.match(/^PRC-(\d+)$/);
    if (codeMatch && codeMatch[1]) {
      startNumber = parseInt(codeMatch[1]) + 1;
    }
  }

  // Generate codes for the number of products
  for (let i = 0; i < count; i++) {
    const currentNumber = startNumber + i;
    const formattedNumber = currentNumber.toString().padStart(3, "0");
    codes.push(`PRC-${formattedNumber}`);
  }

  return codes;
}

// Function to create new custom product pricings (multiple items)
export async function postCustomProductPricing(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Parse product items from form data
    const productItems: PricingItem[] = [];
    let index = 0;

    while (formData.get(`pricing_items[${index}].product_id`)) {
      const productId = Number(
        formData.get(`pricing_items[${index}].product_id`)
      );
      const customPrice = Number(
        formData.get(`pricing_items[${index}].custom_price`)
      );

      // Enhanced validation: ensure all values are valid
      if (
        productId > 0 && // Product must be selected
        customPrice >= 0 && // Price must be non-negative
        !isNaN(productId) && // Must be valid numbers
        !isNaN(customPrice)
      ) {
        productItems.push({
          product_id: productId,
          custom_price: customPrice,
        });
      } else {
        console.log(`Skipping invalid pricing item at index ${index}:`, {
          productId,
          customPrice,
        });
      }
      index++;
    }

    const customerId = Number(formData.get("customer_id"));

    // Customer validation
    if (!customerId || customerId <= 0) {
      return { error: "Customer is required" };
    }

    // Product items validation
    if (productItems.length === 0) {
      return {
        error:
          "At least one valid product item is required. Please select products and set prices for all items.",
      };
    }

    // Check for duplicate products
    const uniqueProductIds = new Set(
      productItems.map((item) => item.product_id)
    );
    if (uniqueProductIds.size !== productItems.length) {
      return { error: "Duplicate products are not allowed" };
    }

    // Check if customer already has pricing
    const existingPricing = await prisma.customProductPricing.findFirst({
      where: {
        customer_id: customerId,
        deleted_at: null,
      },
    });

    if (existingPricing) {
      return { error: "Customer already has custom pricing" };
    }

    // Generate unique pricing codes
    const codes = await generateUniquePricingCodes(productItems.length);

    // Create all pricing items in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const createdItems = [];

      for (let i = 0; i < productItems.length; i++) {
        const item = productItems[i];
        if (!item) continue;

        const code = codes[i];
        if (!code) {
          throw new Error(`Failed to generate code for item ${i + 1}`);
        }

        const created = await tx.customProductPricing.create({
          data: {
            code,
            customer_id: customerId,
            product_id: item.product_id,
            custom_price: item.custom_price,
          },
        });

        createdItems.push(created);
      }

      return createdItems;
    });

    if (result && result.length > 0) {
      return { success: true };
    }

    return { error: "Failed to create pricing items" };
  } catch (error) {
    console.error("Error creating custom product pricing:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
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
    product_id: Number(formData.get("pricing_items[0].product_id")),
    custom_price: Number(formData.get("pricing_items[0].custom_price")),
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

  return redirect("/dashboard/pricing?updated=true");
}

// Function to delete ALL custom pricing for a customer
export async function deleteCustomerPricing(
  _: unknown,
  _formData: FormData,
  customerId: number
): Promise<ActionResult> {
  try {
    // Get customer name for logging/confirmation
    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        deleted_at: null,
      },
      select: {
        name: true,
        code: true,
      },
    });

    if (!customer) {
      return {
        error: "Customer not found",
      };
    }

    // Get all custom pricing records for this customer
    const existingPricings = await prisma.customProductPricing.findMany({
      where: {
        customer_id: customerId,
        deleted_at: null,
      },
      select: {
        id: true,
      },
    });

    if (existingPricings.length === 0) {
      return {
        error: "No custom pricing found for this customer",
      };
    }

    // Delete all custom pricing records for this customer
    await prisma.customProductPricing.deleteMany({
      where: {
        customer_id: customerId,
        deleted_at: null,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to delete customer pricing",
    };
  }

  return redirect(`/dashboard/pricing?deleted=true`);
}

// Function to update existing custom product pricing
export async function updateCustomerPricing(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  try {
    const customerDataId = Number(formData.get("customer_data_id"));

    if (!customerDataId || customerDataId <= 0) {
      return { error: "Invalid customer data" };
    }

    // Parse product items from form data
    const productItems: PricingItem[] = [];
    let index = 0;

    while (formData.get(`pricing_items[${index}].product_id`)) {
      const id = formData.get(`pricing_items[${index}].id`);
      const productId = Number(
        formData.get(`pricing_items[${index}].product_id`)
      );
      const customPrice = Number(
        formData.get(`pricing_items[${index}].custom_price`)
      );

      if (
        productId > 0 &&
        customPrice >= 0 &&
        !isNaN(productId) &&
        !isNaN(customPrice)
      ) {
        const item: PricingItem = {
          id: id ? Number(id) : undefined,
          product_id: productId,
          custom_price: customPrice,
        };
        productItems.push(item);
      }
      index++;
    }

    if (productItems.length === 0) {
      return {
        error: "At least one valid product item is required",
      };
    }

    // Check for duplicate products
    const uniqueProductIds = new Set(
      productItems.map((item) => item.product_id)
    );
    if (uniqueProductIds.size !== productItems.length) {
      return { error: "Duplicate products are not allowed" };
    }

    // Get existing pricing items
    const existingItems = await prisma.customProductPricing.findMany({
      where: {
        customer_id: customerDataId,
        deleted_at: null,
      },
      select: {
        id: true,
        product_id: true,
      },
    });

    // Update in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete items that are no longer in the form
      const existingIds = existingItems.map((item) => item.id);
      const updatedIds = productItems
        .filter(
          (item): item is PricingItem & { id: number } =>
            typeof item.id === "number"
        )
        .map((item) => item.id);

      const idsToDelete = existingIds.filter((id) => !updatedIds.includes(id));

      if (idsToDelete.length > 0) {
        await tx.customProductPricing.updateMany({
          where: {
            id: {
              in: idsToDelete,
            },
          },
          data: {
            deleted_at: new Date(),
          },
        });
      }

      // Update existing items and create new ones
      const updatedItems = [];

      for (const item of productItems) {
        if (item.id) {
          // Update existing item
          const updated = await tx.customProductPricing.update({
            where: {
              id: item.id,
            },
            data: {
              product_id: item.product_id,
              custom_price: item.custom_price,
            },
          });
          updatedItems.push(updated);
        } else {
          // Create new item
          const codes = await generateUniquePricingCodes(1);
          const code = codes[0];

          if (!code) {
            throw new Error("Failed to generate code for new item");
          }

          const created = await tx.customProductPricing.create({
            data: {
              code,
              customer_id: customerDataId,
              product_id: item.product_id,
              custom_price: item.custom_price,
            },
          });
          updatedItems.push(created);
        }
      }

      return updatedItems;
    });

    if (result && result.length > 0) {
      return { success: true };
    }

    return { error: "Failed to update pricing items" };
  } catch (error) {
    console.error("Error updating custom product pricing:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

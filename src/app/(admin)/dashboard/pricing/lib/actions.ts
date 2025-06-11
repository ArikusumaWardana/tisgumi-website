"use server";

import { singleCustomProductPricingSchema } from "@/lib/schema";
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

// Function to create new custom product pricings (multiple items)
export async function postCustomProductPricing(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Parse product items from form data
    const productItems = [];
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

    // Auto-generate unique pricing codes
    const generateUniquePricingCodes = async (
      count: number
    ): Promise<string[]> => {
      const codes = [];

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
    };

    // Generate unique codes for all products
    const generatedCodes = await generateUniquePricingCodes(
      productItems.length
    );

    // Create multiple custom product pricings with unique codes
    const createPromises = productItems.map((item, index) =>
      prisma.customProductPricing.create({
        data: {
          code:
            generatedCodes[index] ||
            `PRC-${(index + 1).toString().padStart(3, "0")}`, // Format: PRC-001, PRC-002, etc.
          customer_id: customerId,
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

  return redirect("/dashboard/pricing?created=true");
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

// Function to update customer pricing (multiple products)
export async function updateCustomerPricing(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  try {
    const customerId = Number(formData.get("customer_data_id"));

    // Parse pricing items from form data
    const pricingItems = [];
    let index = 0;

    while (formData.get(`pricing_items[${index}].product_id`)) {
      const productId = Number(
        formData.get(`pricing_items[${index}].product_id`)
      );
      const customPrice = Number(
        formData.get(`pricing_items[${index}].custom_price`)
      );
      const existingId = formData.get(`pricing_items[${index}].id`);

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

    // Auto-generate unique pricing codes for new items
    const generateUniquePricingCodes = async (
      count: number
    ): Promise<string[]> => {
      const codes = [];

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
    };

    // Count items that need new codes (items without id)
    const newItemsCount = pricingItems.filter((item) => !item.id).length;
    const generatedCodes =
      newItemsCount > 0 ? await generateUniquePricingCodes(newItemsCount) : [];
    let codeIndex = 0;

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
              code:
                generatedCodes[codeIndex] ||
                `PRC-${(codeIndex + 1).toString().padStart(3, "0")}`, // Use generated code
              customer_id: customerId,
              product_id: item.product_id,
              custom_price: item.custom_price,
            },
          })
        );
        codeIndex++;
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

  return redirect("/dashboard/pricing?updated=true");
}

"use server";

import { productSchema } from "@/lib/schema";
import { ActionResult } from "@/types";
import { redirect } from "next/navigation";
import prisma from "../../../../../../lib/prisma";

// Function to create a new product
export async function postProduct(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  const validate = productSchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
    default_price: Number(formData.get("default_price")),
    category_id: Number(formData.get("category_id")),
    status: formData.get("status"),
  });

  // If the validation fails, return an error message
  if (!validate.success) {
    return { error: validate.error.errors[0].message };
  }

  // Check if the product already exists
  const existingProduct = await prisma.product.findFirst({
    where: {
      code: validate.data.code,
    },
  });

  // Try to create a new product
  try {
    // If the product already exists, return an error message
    if (existingProduct) {
      return { error: "Product already exists" };
    }

    // Create the new product
    await prisma.product.create({
      data: {
        code: validate.data.code,
        name: validate.data.name,
        default_price: validate.data.default_price,
        category_id: validate.data.category_id,
        status: validate.data.status,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to create product",
    };
  }

  // Redirect to the products page
  return redirect("/dashboard/products");
}

// Function to update a product
export async function updateProduct(
  _: unknown,
  formData: FormData,
  id: number | undefined
): Promise<ActionResult> {
  const validate = productSchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
    default_price: Number(formData.get("default_price")),
    category_id: Number(formData.get("category_id")),
    status: formData.get("status"),
  });

  // If the validation fails, return an error message
  if (!validate.success) {
    return { error: validate.error.errors[0].message };
  }

  // If the id is undefined, return an error message
  if (id === undefined) {
    return {
      error: "Product not found",
    };
  }

  // Try to update the product
  try {
    await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        code: validate.data.code,
        name: validate.data.name,
        default_price: validate.data.default_price,
        category_id: validate.data.category_id,
        status: validate.data.status,
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to update product",
    };
  }

  return redirect("/dashboard/products");
}

// Function to delete a product
export async function deleteProduct(
  _: unknown,
  formData: FormData,
  id: number
): Promise<ActionResult> {
  // Try to delete the product
  try {
    await prisma.product.update({
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
      error: "Failed to delete product",
    };
  }

  return redirect(`/dashboard/products`);
}

"use server";

import { categorySchema } from "@/lib/schema";
import { ActionResult } from "@/types";
import { redirect } from "next/navigation";
import prisma from "../../../../../../lib/prisma";

// Function to create a new category
export async function postCategory(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  const validate = categorySchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
  });

  // If the validation fails, return an error message
  if (!validate.success) {
    return { error: validate.error.errors[0].message };
  }

  // Check if the category already exists
  const existingCategory = await prisma.categories.findFirst({
    where: {
      code: validate.data.code,
    },
  });

  // Try to create a new category
  try {
    // If the category already exists, return an error message
    if (existingCategory) {
      return { error: "Category already exists" };
    }

    // Create the new category
    await prisma.categories.create({
      data: {
        code: validate.data.code,
        name: validate.data.name,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to create category",
    };
  }

  // Redirect to the categories page
  return redirect("/dashboard/categories");
}

// Function to update a category
export async function updateCategory(
  _: unknown,
  formData: FormData,
  id: number | undefined
): Promise<ActionResult> {
  const validate = categorySchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
  });

  // If the validation fails, return an error message
  if (!validate.success) {
    return { error: validate.error.errors[0].message };
  }

  // If the id is undefined, return an error message
  if (id === undefined) {
    return {
      error: "Category not found",
    };
  }

  // Try to update the category
  try {
    await prisma.categories.update({
      where: {
        id: id,
      },
      data: {
        code: validate.data.code,
        name: validate.data.name,
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to update category",
    };
  }

  return redirect("/dashboard/categories");
}

// Function to delete a category
export async function deleteCategory(
  _: unknown,
  formData: FormData,
  id: number
): Promise<ActionResult> {

     // Try to delete the category 
     try {
        await prisma.categories.update({
            where: {
                id: id
             }, 
             data: {
                deleted_at: new Date()
             }
        })
     } catch (error) {
        console.log(error);
        return {
            error: "Failed to delete category"
        }
     } 

  return redirect(`/dashboard/categories`);
}

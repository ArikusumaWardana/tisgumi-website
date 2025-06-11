"use server";

import { customerSchema } from "@/lib/schema";
import { ActionResult } from "@/types";
import { redirect } from "next/navigation";
import prisma from "../../../../../../lib/prisma";

// Function to get count of customers for auto-generation
export async function getCustomersCount() {
  try {
    // Get count of customers (excluding deleted ones)
    const count = await prisma.customer.count({
      where: {
        deleted_at: null,
      },
    });

    return count;
  } catch (error) {
    console.error("Error fetching customers count:", error);
    return 0;
  }
}

// Function to create a new customer
export async function postCustomer(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  const validate = customerSchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    status: formData.get("status"),
  });

  // If the validation fails, return an error message
  if (!validate.success) {
    return { error: validate.error.errors[0]?.message ?? "Validation failed" };
  }

  // Format phone number with +62 prefix
  const formattedPhone = `62${validate.data.phone}`;

  // Check if the customer already exists
  const existingCustomer = await prisma.customer.findFirst({
    where: {
      code: validate.data.code,
    },
  });

  // Try to create a new customer
  try {
    // If the customer already exists, return an error message
    if (existingCustomer) {
      return { error: "Customer already exists" };
    }

    // Create the new customer
    await prisma.customer.create({
      data: {
        code: validate.data.code,
        name: validate.data.name,
        phone: formattedPhone,
        status: validate.data.status,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to create customer",
    };
  }

  // Redirect to the customers page with success parameter
  return redirect("/dashboard/customers?created=true");
}

// Function to update a customer
export async function updateCustomer(
  _: unknown,
  formData: FormData,
  id: number | undefined
): Promise<ActionResult> {
  const validate = customerSchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    status: formData.get("status"),
  });

  // If the validation fails, return an error message
  if (!validate.success) {
    return { error: validate.error.errors[0]?.message ?? "Validation failed" };
  }

  // Format phone number with +62 prefix
  const formattedPhone = `62${validate.data.phone}`;

  // If the id is undefined, return an error message
  if (id === undefined) {
    return {
      error: "Customer not found",
    };
  }

  // Try to update the customer
  try {
    await prisma.customer.update({
      where: {
        id: id,
      },
      data: {
        code: validate.data.code,
        name: validate.data.name,
        phone: formattedPhone,
        status: validate.data.status,
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to update customer",
    };
  }

  return redirect("/dashboard/customers?updated=true");
}

// Function to delete a customer
export async function deleteCustomer(
  _: unknown,
  _formData: FormData,
  id: number
): Promise<ActionResult> {
  // Try to delete the customer
  try {
    await prisma.customer.update({
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
      error: "Failed to delete customer",
    };
  }

  return redirect(`/dashboard/customers?deleted=true`);
}

"use server";

import { customerSchema } from "@/lib/schema";
import { ActionResult } from "@/types";
import { redirect } from "next/navigation";
import prisma from "../../../../../../lib/prisma";

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
    return { error: validate.error.errors[0].message };
  }

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
        phone: validate.data.phone,
        status: validate.data.status,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to create customer",
    };
  }

  // Redirect to the customers page
  return redirect("/dashboard/customers");
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
    return { error: validate.error.errors[0].message };
  }

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
        phone: validate.data.phone,
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

  return redirect("/dashboard/customers");
}

// Function to delete a customer
export async function deleteCustomer(
  _: unknown,
  formData: FormData,
  id: number
): Promise<ActionResult> {

     // Try to delete the customer 
     try {
        await prisma.customer.update({
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
            error: "Failed to delete customer"
        }
     } 

  return redirect(`/dashboard/customers`);
}

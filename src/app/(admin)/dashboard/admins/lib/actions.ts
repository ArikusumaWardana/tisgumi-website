"use server";

import { adminSchema } from "@/lib/schema";
import { ActionResult } from "@/types";
import { redirect } from "next/navigation";
import prisma from "../../../../../../lib/prisma";
import bcrypt from "bcrypt";

// Function to create a new admin
export async function postAdmin(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  const validate = adminSchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  // If the validation fails, return an error message
  if (!validate.success) {
    return { error: validate.error.errors[0].message };
  }

  // Hash the password input
  const hashedPassword = await bcrypt.hash(validate.data.password, 12);

  // Try to create a new admin
  try {
    await prisma.user.create({
      data: {
        code: validate.data.code,
        name: validate.data.name,
        email: validate.data.email,
        phone: validate.data.phone,
        password: hashedPassword,
        role: "admin",
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to create admin",
    };
  }

  // Redirect to the admins page
  return redirect("/dashboard/admins");
}

// Function to update a admin
export async function updateAdmin(
  _: unknown,
  formData: FormData,
  id: number | undefined
): Promise<ActionResult> {
  const validate = adminSchema.safeParse({
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
      error: "Admin not found",
    };
  }

  // Try to update the admin
  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        code: validate.data.code,
        name: validate.data.name,
        email: validate.data.email,
        phone: validate.data.phone,
        password: validate.data.password,
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to update admin",
    };
  }

  return redirect("/dashboard/admins");
}

// Function to delete a admin
export async function deleteAdmin(
  _: unknown,
  formData: FormData,
  id: number
): Promise<ActionResult> {

     // Try to delete the admin 
     try {
        await prisma.user.update({
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
            error: "Failed to delete admin"
        }
     } 

  return redirect(`/dashboard/admins`);
}

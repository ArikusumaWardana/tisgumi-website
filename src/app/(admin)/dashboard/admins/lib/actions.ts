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

  // Format phone number with +62 prefix
  const formattedPhone = `+62${validate.data.phone}`;

  // Check if the admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: {
      code: validate.data.code,
      email: validate.data.email,
    },
  });

  // Try to create a new admin
  try {
    // If the admin already exists, return an error message
    if (existingAdmin) {
      return { error: "Admin already exists" };
    }

    // Create the new admin
    await prisma.user.create({
      data: {
        code: validate.data.code,
        name: validate.data.name,
        email: validate.data.email,
        phone: formattedPhone,
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

  // Format phone number with +62 prefix
  const formattedPhone = `+62${validate.data.phone}`;

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
        phone: formattedPhone,
        password: hashedPassword,
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
        id: id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to delete admin",
    };
  }

  return redirect(`/dashboard/admins`);
}

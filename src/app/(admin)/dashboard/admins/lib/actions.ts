"use server";

import { adminSchema, adminEditSchema } from "@/lib/schema";
import { ActionResult } from "@/types";
import { redirect } from "next/navigation";
import prisma from "../../../../../../lib/prisma";
import bcrypt from "bcrypt";
import { getUser } from "@/lib/auth";

// Function to get total admin count for code generation
export async function getAdminsCount(): Promise<number> {
  try {
    const count = await prisma.user.count({
      where: {
        deleted_at: null,
        role: "admin", // Only count admins, not superadmin
      },
    });
    return count;
  } catch (error) {
    console.error("Error fetching admins count:", error);
    return 0;
  }
}

// Function to create a new admin
export async function postAdmin(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  // Check user role for access control
  const { user } = await getUser();

  // If user is not superadmin, return error
  if (!user || user.role !== "superadmin") {
    return {
      error: "Access denied. Only superadmin can create admins.",
    };
  }

  const validate = adminSchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  // If the validation fails, return an error message
  if (!validate.success) {
    return { error: validate.error.errors[0]?.message ?? "Validation failed" };
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

  // Redirect to the admins page with success parameter
  return redirect("/dashboard/admins?created=true");
}

// Function to update a admin
export async function updateAdmin(
  _: unknown,
  formData: FormData,
  id: number | undefined
): Promise<ActionResult> {
  // Check user role for access control
  const { user } = await getUser();

  // If user is not superadmin, return error
  if (!user || user.role !== "superadmin") {
    return {
      error: "Access denied. Only superadmin can update admins.",
    };
  }

  const passwordValue = formData.get("password") as string;

  const validate = adminEditSchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: passwordValue || undefined,
  });

  // If the validation fails, return an error message
  if (!validate.success) {
    return { error: validate.error.errors[0]?.message ?? "Validation failed" };
  }

  // Format phone number with +62 prefix
  const formattedPhone = `+62${validate.data.phone}`;

  // If the id is undefined, return an error message
  if (id === undefined) {
    return {
      error: "Admin not found",
    };
  }

  // Prepare update data
  const updateData: {
    code: string;
    name: string;
    email: string;
    phone: string;
    updated_at: Date;
    password?: string;
  } = {
    code: validate.data.code,
    name: validate.data.name,
    email: validate.data.email,
    phone: formattedPhone,
    updated_at: new Date(),
  };

  // Only update password if it's provided
  if (validate.data.password && validate.data.password.trim() !== "") {
    const hashedPassword = await bcrypt.hash(validate.data.password, 12);
    updateData.password = hashedPassword;
  }

  // Try to update the admin
  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: updateData,
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to update admin",
    };
  }

  return redirect("/dashboard/admins?updated=true");
}

// Function to delete a admin
export async function deleteAdmin(
  _: unknown,
  _formData: FormData,
  id: number
): Promise<ActionResult> {
  // Check user role for access control
  const { user } = await getUser();

  // If user is not superadmin, return error
  if (!user || user.role !== "superadmin") {
    return {
      error: "Access denied. Only superadmin can delete admins.",
    };
  }

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

  return redirect("/dashboard/admins?deleted=true");
}

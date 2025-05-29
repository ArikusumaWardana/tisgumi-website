"use server";

import { redirect } from "next/navigation";
import { ActionResult } from "@/types";
import { loginSchema } from "@/lib/schema";
import prisma from "../../../../../lib/prisma";
import bcrypt from "bcrypt";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

// Login action
export async function LoginAction(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  // Validate form data
  const validate = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validate.success) {
    return {
      error: validate.error.errors[0].message,
    };
  }

  // Check if user exists in database
  const existingUser = await prisma.user.findFirst({
    where: {
      email: validate.data.email,
      role: {
        in: ["superadmin", "admin"],
      },
    },
  });

  // If user does not exist return error message
  if (!existingUser) {
    return {
      error: "email not found",
    };
  }

  // Compare password with hashed password in database
  const comparePassword = bcrypt.compareSync(
    validate.data.password,
    existingUser.password
  );

  // If password is incorrect return error message
  if (!comparePassword) {
    return {
      error: "email or password is incorrect",
    };
  }

  // Create session
  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect("/dashboard");
}

"use server";

import { categorySchema } from "@/lib/schema";
import { ActionResult } from "@/types";
import { redirect } from "next/navigation";
import prisma from "../../../../../../lib/prisma";
export async function postCategory(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  const validate = categorySchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
  });

  if (!validate.success) {
    return { error: validate.error.errors[0].message };
  }


     try {
          await prisma.categories.create({
               data: {
                    code: validate.data.code,
                    name: validate.data.name,
               }
          })
     } catch (error) {
          console.log(error)
          return redirect("/dashboard/categories/create")
     }

  return redirect("/dashboard/categories");
}

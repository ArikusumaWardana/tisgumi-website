"use client";

import React, { useActionState } from "react";
import { ActionResult } from "@/types";
import { deleteCategory } from "../lib/actions";
import { useFormStatus } from "react-dom";

const initialState: ActionResult = {
  error: "",
};

interface FormDeleteProps {
  id: number;
}

function SubmitButton() {
     const { pending } = useFormStatus();
     return (
       <button
         type="submit"
         className="text-red-600 text-sm hover:bg-red-600 w-full hover:text-white px-2 py-1 rounded-sm text-left"
       >
         {pending ? "Deleting..." : "Delete"}
       </button>
     );
}

export default function FormDelete({ id }: FormDeleteProps) {

     const deleteCategoryWithId = (
       _: unknown,
       formData: FormData
     ) => deleteCategory(_, formData, id);

  const [state, formAction] = useActionState(deleteCategoryWithId, initialState);

  return (
    <form action={formAction}>
      <SubmitButton />
    </form>
  );
}

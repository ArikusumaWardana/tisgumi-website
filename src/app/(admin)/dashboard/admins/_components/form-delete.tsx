"use client";

import React, { useActionState } from "react";
import { ActionResult } from "@/types";
import { deleteAdmin } from "../lib/actions";
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

     const deleteAdminWithId = (
       _: unknown,
       formData: FormData
     ) => deleteAdmin(_, formData, id);

  const [state, formAction] = useActionState(deleteAdminWithId, initialState);

  return (
    <form action={formAction}>
      <SubmitButton />
    </form>
  );
}

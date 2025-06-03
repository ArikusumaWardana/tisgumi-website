"use client";

import React, { useActionState } from "react";
import { ActionResult } from "@/types";
import { deleteCustomProductPricing } from "../lib/actions";
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

     const deleteCustomProductPricingWithId = (
       _: unknown,
       formData: FormData
     ) => deleteCustomProductPricing(_, formData, id);

  const [_state, formAction] = useActionState(deleteCustomProductPricingWithId, initialState);

  return (
    <form action={formAction}>
      <SubmitButton />
    </form>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { ActionResult } from "@/types";
import { deleteCustomerPricing } from "../lib/actions";

// Initial state for the form
const initialState: ActionResult = {
  error: "",
};

// Submit button for the form
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-transparent text-red-600 text-sm hover:bg-red-600 w-full hover:text-white px-2 py-1 rounded-sm text-left shadow-none"
    >
      <TrashIcon className="w-4 h-4" />
      {pending ? "Deleting Custom Pricing..." : "Delete Custom Pricing"}
    </Button>
  );
}

interface FormDeleteCustomerProps {
  customerId: number;
  customerName: string;
  pricingCount: number;
}

export default function FormDeleteCustomer({
  customerId,
}: FormDeleteCustomerProps) {
  // Delete action with customer ID
  const deleteCustomerPricingWithId = (_: unknown, formData: FormData) =>
    deleteCustomerPricing(_, formData, customerId);

  // State and form action
  const [, formAction] = useActionState(
    deleteCustomerPricingWithId,
    initialState
  );

  return (
    <form action={formAction}>
      <SubmitButton />
    </form>
  );
}

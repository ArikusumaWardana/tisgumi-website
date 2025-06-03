"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { ActionResult } from "@/types";
import { useFormStatus } from "react-dom";
import { deleteOrder } from "../lib/actions";

// Initial state for the form
const initialState: ActionResult = {
  error: "",
};

// Submit button component
function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="outline"
      size="sm"
      disabled={pending}
      className="w-full border-red-200 text-red-600 hover:bg-red-50"
    >
      {pending ? "Deleting..." : "Delete Order"}
    </Button>
  );
}

// Delete order form component
export default function FormDelete({ id }: { id: number }) {
  const deleteOrderWithId = (_: unknown, formData: FormData) =>
    deleteOrder(_, formData, id);

  const [state, formAction] = useActionState(deleteOrderWithId, initialState);

  return (
    <div className="space-y-2 min-w-[200px]">
      <div className="flex items-center gap-2 p-2 bg-red-50 rounded-md">
        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
        <div>
          <p className="text-xs text-red-700 font-medium">
            This action cannot be undone
          </p>
        </div>
      </div>

      {state.error && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
          {state.error}
        </div>
      )}

      <form action={formAction}>
        <DeleteButton />
      </form>
    </div>
  );
}

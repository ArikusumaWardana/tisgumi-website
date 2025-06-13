"use client";

import { ActionResult } from "@/types";
import { LogOut } from "lucide-react";
import React from "react";
import { Logout } from "../lib/actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const intialState: ActionResult = {
  error: "",
};

  function SubmitButton() {
    const { pending } = useFormStatus();
  return (
    <button className="flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" disabled={pending}>
      <LogOut className="w-5 h-5" />
      <span>{pending ? "Logging out..." : "Logout"}</span>
    </button>
  );
}

export default function FormLogout() {
  const [, formAction] = useActionState(Logout, intialState);

  return (
    <form action={formAction}>
      <SubmitButton />
    </form>
  );
}

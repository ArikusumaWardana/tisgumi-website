"use client";

import { AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";
import Link from "next/link";
import { ActionResult } from "@/types";
import { useActionState } from "react";
import { postAdmin, updateAdmin } from "../lib/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFormStatus } from "react-dom";
import { User } from "@prisma/client";

// Initial state for the form
const initialState: ActionResult = {
  error: "",
};

interface FormAdminProps {
  type?: "create" | "update";
  data?: User | null;
}

// Submit button for the form
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Save className="w-4 h-4 mr-1" />
      {pending ? "Saving..." : "Save Admin"}
    </Button>
  );
}

// Form component for the admin
export default function FormAdmin({
  type = "create",
  data = null,
}: FormAdminProps) {
  // Update the admin with the id
  const updateAdminWithId = (_: unknown, formData: FormData) =>
    updateAdmin(_, formData, data?.id);

  // State and form action for the admin
  const [state, formAction] = useActionState(
    type === "create" ? postAdmin : updateAdminWithId,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Admin Information
        </h2>

        {state.error !== "" && (
          <Alert variant="destructive" className="">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Code Field */}

          <div className="space-y-2">
            <Label htmlFor="code">
              Admin Code <span className="text-red-600">*</span>
            </Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="e.g., ADM-001"
              required
              defaultValue={data?.code}
            />
            <p className="text-xs text-gray-500">
              Unique identifier for the admin
            </p>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Admin Name <span className="text-red-600">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g., Admin"
              required
              defaultValue={data?.name}
            />
            <p className="text-xs text-gray-500">
              Display name for the admin
            </p>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-600">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="e.g., admin@example.com"
              required
              defaultValue={data?.email}
            />
            <p className="text-xs text-gray-500">
              Email for the admin
            </p>
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone <span className="text-red-600">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="text"
              placeholder="e.g., +6281234567890"
              required
              defaultValue={data?.phone}
            />
            <p className="text-xs text-gray-500">
              Phone number for the admin
            </p>
          </div>
          
          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password <span className="text-red-600">*</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="e.g., **********"
              required
            />  
            <p className="text-xs text-gray-500">
              Password for the admin
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link href="/dashboard/admins">
          <Button variant="outline">Cancel</Button>
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}

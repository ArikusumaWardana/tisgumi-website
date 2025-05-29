"use client";

import { AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";
import Link from "next/link";
import { ActionResult } from "@/types";
import { useActionState } from "react";
import { postCategory } from "../categories/lib/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFormStatus } from "react-dom";

export default function FormCategory() {
  const initialState: ActionResult = {
    error: "",
  };

  const [state, formAction] = useActionState(postCategory, initialState);

     function SubmitButton() {
          const { pending } = useFormStatus()
          return (
            <Button type="submit" disabled={pending}>
              <Save className="w-4 h-4 mr-2" />
              {pending ? 'Creating...' : 'Create Category'}
            </Button>
          );
     }
  return (
    <form action={formAction} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Category Information
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
            <Label htmlFor="code">Category Code *</Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="e.g., CAT-001"
              required
            />
            <p className="text-xs text-gray-500">
              Unique identifier for the category
            </p>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g., Main Course"
              required
            />
            <p className="text-xs text-gray-500">
              Display name for the category
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link href="/dashboard/categories">
          <Button variant="outline">Cancel</Button>
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}

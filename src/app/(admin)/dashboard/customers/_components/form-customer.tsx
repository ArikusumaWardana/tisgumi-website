"use client";

import { AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ActionResult } from "@/types";
import { useActionState } from "react";
import { postCustomer, updateCustomer } from "../lib/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFormStatus } from "react-dom";
import { Customer } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Initial state for the form
const initialState: ActionResult = {
  error: "",
};

interface FormCustomerProps {
  type?: "create" | "update";
  data?: Customer | null;
}

// Submit button for the form
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Save className="w-4 h-4 mr-1" />
      {pending ? "Saving..." : "Save Customer"}
    </Button>
  );
}

// Form component for the customer
export default function FormCustomer({
  type = "create",
  data = null,
}: FormCustomerProps) {
  // Phone number state and formatting
  const [phoneDisplay, setPhoneDisplay] = useState<string>("");
  const [phoneValue, setPhoneValue] = useState<string>("");

  // Initialize phone values
  useEffect(() => {
    if (data?.phone) {
      // Remove +62 prefix if exists for editing
      const cleanPhone = data.phone.startsWith("+62")
        ? data.phone.slice(3)
        : data.phone;
      setPhoneDisplay(cleanPhone);
      setPhoneValue(cleanPhone);
    }
  }, [data?.phone]);

  // Phone formatting function
  const formatPhone = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // If starts with 0, remove it
    const cleanDigits = digits.startsWith("0") ? digits.slice(1) : digits;

    // Limit to reasonable phone number length (12 digits max for Indonesian numbers)
    const limitedDigits = cleanDigits.slice(0, 12);

    return limitedDigits;
  };

  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedPhone = formatPhone(inputValue);

    setPhoneDisplay(formattedPhone);
    setPhoneValue(formattedPhone);
  };

  // Update the customer with the id
  const updateCustomerWithId = (_: unknown, formData: FormData) =>
    updateCustomer(_, formData, data?.id);

  // State and form action for the customer
  const [state, formAction] = useActionState(
    type === "create" ? postCustomer : updateCustomerWithId,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Customer Information
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
              Customer Code <span className="text-red-600">*</span>
            </Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="e.g., CUS-001"
              required
              defaultValue={data?.code}
            />
            <p className="text-xs text-gray-500">
              Unique identifier for the customer
            </p>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Customer Name <span className="text-red-600">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g., Main Course"
              required
              defaultValue={data?.name}
            />
            <p className="text-xs text-gray-500">
              Display name for the customer
            </p>
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone <span className="text-red-600">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">+62</span>
              </div>
              <Input
                id="phone-display"
                type="text"
                placeholder="81234567890"
                required
                value={phoneDisplay}
                onChange={handlePhoneChange}
                className="pl-12"
                maxLength={12}
              />
              {/* Hidden input to store the actual value for form submission */}
              <input type="hidden" name="phone" value={phoneValue} />
            </div>
            <p className="text-xs text-gray-500">
              Indonesian phone number (without leading 0)
            </p>
            {phoneDisplay && (
              <p className="text-xs text-green-600">
                Will be saved as: +62{phoneDisplay}
              </p>
            )}
          </div>

          {/* Status Field */}
          <div className="space-y-2 w-full">
            <Label htmlFor="status">
              Status <span className="text-red-600">*</span>
            </Label>
            <Select
              name="status"
              required
              defaultValue={data?.status || "active"}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link href="/dashboard/customers">
          <Button variant="outline">Cancel</Button>
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}

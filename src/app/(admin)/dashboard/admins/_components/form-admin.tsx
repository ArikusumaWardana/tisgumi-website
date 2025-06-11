"use client";

import { AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ActionResult } from "@/types";
import { useActionState } from "react";
import { postAdmin, updateAdmin, getAdminsCount } from "../lib/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFormStatus } from "react-dom";
import { User } from "@prisma/client";
import { useFormLoading } from "@/hooks/use-form-loading";
import FormLoading from "@/components/ui/form-loading";

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
  // Phone number state and formatting
  const [phoneDisplay, setPhoneDisplay] = useState<string>("");
  const [phoneValue, setPhoneValue] = useState<string>("");

  // State for code input
  const [codeValue, setCodeValue] = useState<string>(data?.code || "");

  // State for password fields
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  // Generate admin code function
  const generateAdminCode = async (): Promise<string> => {
    try {
      // Fetch count from actions
      const count = await getAdminsCount();
      const nextNumber = count + 1;
      const formattedNumber = nextNumber.toString().padStart(3, "0");
      return `ADM-${formattedNumber}`;
    } catch {
      // Fallback jika terjadi error
      const timestamp = Date.now();
      const codeNumber = timestamp % 1000;
      const formattedNumber = codeNumber.toString().padStart(3, "0");
      return `ADM-${formattedNumber}`;
    }
  };

  // Use form loading hook
  const {
    isLoading,
    loadingProgress,
    error: loadingError,
    generatedCode,
  } = useFormLoading({
    ...(type === "create" &&
      !codeValue && { autoGenerateCode: generateAdminCode }),
    skipLoading: type === "update" || !!codeValue,
  });

  // Set generated code when available
  useEffect(() => {
    if (generatedCode && type === "create" && !codeValue) {
      setCodeValue(generatedCode);
    }
  }, [generatedCode, type, codeValue]);

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

  // Handle password validation
  const validatePasswords = (pwd: string, confirmPwd: string) => {
    if (type === "update" && pwd === "" && confirmPwd === "") {
      // Both empty is valid for update (keeps current password)
      setPasswordError("");
      return true;
    }

    if (pwd !== confirmPwd) {
      setPasswordError("Passwords do not match");
      return false;
    }

    if (pwd && pwd.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }

    setPasswordError("");
    return true;
  };

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePasswords(newPassword, confirmPassword);
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    validatePasswords(password, newConfirmPassword);
  };

  // Update the admin with the id
  const updateAdminWithId = (_: unknown, formData: FormData) =>
    updateAdmin(_, formData, data?.id);

  // State and form action for the admin
  const [state, formAction] = useActionState(
    type === "create" ? postAdmin : updateAdminWithId,
    initialState
  );

  // Show loading state
  if (isLoading) {
    return (
      <FormLoading
        loadingProgress={loadingProgress}
        title="Preparing Admin Form"
        description="Generating unique admin code..."
      />
    );
  }

  // Show loading error
  if (loadingError) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{loadingError}</AlertDescription>
        </Alert>
      </div>
    );
  }

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
              value={codeValue}
              onChange={(e) => setCodeValue(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              {`Unique identifier for the admin`}
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
              {`Display name for the admin`}
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
            <p className="text-xs text-gray-500">{`Email for the admin`}</p>
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
              {`Indonesian phone number (without leading 0)`}
            </p>
            {phoneDisplay && (
              <p className="text-xs text-green-600">
                {`Will be saved as: +62${phoneDisplay}`}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password{" "}
              {type === "create" && <span className="text-red-600">*</span>}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={
                type === "create"
                  ? "e.g., **********"
                  : "Leave empty to keep current password"
              }
              required={type === "create"}
              value={password}
              onChange={handlePasswordChange}
            />
            <p className="text-xs text-gray-500">
              {type === "create"
                ? "Password for the admin account"
                : "Leave empty to keep current password"}
            </p>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirm_password">
              Confirm Password{" "}
              {type === "create" && <span className="text-red-600">*</span>}
            </Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder={
                type === "create"
                  ? "e.g., **********"
                  : "Leave empty to keep current password"
              }
              required={type === "create"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <p className="text-xs text-gray-500">
              {type === "create"
                ? "Re-enter the password"
                : "Leave empty to keep current password"}
            </p>
            {passwordError && (
              <p className="text-xs text-red-600">{passwordError}</p>
            )}
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

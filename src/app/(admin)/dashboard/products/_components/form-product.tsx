"use client";

import { AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ActionResult } from "@/types";
import { useActionState } from "react";
import { postProduct, updateProduct, getProductsCount } from "../lib/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFormStatus } from "react-dom";
import { Product } from "@prisma/client";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatToRupiah,
  handlePriceInputChange,
  getNumericValue,
} from "@/utils/currency";
import { useFormLoading } from "@/hooks/use-form-loading";
import FormLoading from "@/components/ui/form-loading";

// Initial state for the form
const initialState: ActionResult = {
  error: "",
};

interface Category {
  id: number;
  code: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

interface FormProductProps {
  type?: "create" | "update";
  data?: Product | null;
  categories?: Category[];
}

// Submit button for the form
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Save className="w-4 h-4 mr-1" />
      {pending ? "Saving..." : "Save Product"}
    </Button>
  );
}

// Form component for the product
export default function FormProduct({
  type = "create",
  data = null,
  categories: propCategories = [],
}: FormProductProps) {
  // State for formatted price display
  const [formattedPrice, setFormattedPrice] = useState<string>(
    data?.default_price ? formatToRupiah(data.default_price.toString()) : ""
  );

  // State for code input
  const [codeValue, setCodeValue] = useState<string>(data?.code || "");

  // Generate product code function
  const generateProductCode = async (): Promise<string> => {
    try {
      // Fetch count from actions
      const count = await getProductsCount();
      const nextNumber = count + 1;
      const formattedNumber = nextNumber.toString().padStart(3, "0");
      return `PRD-${formattedNumber}`;
    } catch (error) {
      // Fallback jika terjadi error
      const timestamp = Date.now();
      const codeNumber = timestamp % 1000;
      const formattedNumber = codeNumber.toString().padStart(3, "0");
      return `PRD-${formattedNumber}`;
    }
  };

  // Use form loading hook - skip loading if categories are provided via props
  const {
    isLoading,
    loadingProgress,
    error: loadingError,
    data: loadedData,
    generatedCode,
  } = useFormLoading({
    dependencies: propCategories.length === 0 ? [] : [], // Categories loaded from parent
    ...(type === "create" &&
      !codeValue && { autoGenerateCode: generateProductCode }),
    skipLoading: type === "update" || !!codeValue,
  });

  // Determine which categories to use
  const categories =
    propCategories.length > 0 ? propCategories : loadedData[0] || [];

  // Set generated code when available
  useEffect(() => {
    if (generatedCode && type === "create" && !codeValue) {
      setCodeValue(generatedCode);
    }
  }, [generatedCode, type, codeValue]);

  // Update the product with the id
  const updateProductWithId = (_: unknown, formData: FormData) =>
    updateProduct(_, formData, data?.id);

  // State and form action for the product
  const [state, formAction] = useActionState(
    type === "create" ? postProduct : updateProductWithId,
    initialState
  );

  // Handle price input change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = handlePriceInputChange(e.target.value);
    setFormattedPrice(formatted);
  };

  // Show loading state
  if (isLoading) {
    return (
      <FormLoading
        loadingProgress={loadingProgress}
        title="Preparing Product Form"
        description="Loading categories and generating product code..."
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
          Product Information
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
              Product Code <span className="text-red-600">*</span>
            </Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="e.g., PRD-001"
              required
              value={codeValue}
              onChange={(e) => setCodeValue(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Unique identifier for the product
            </p>
          </div>

          {/* Category Field */}
          <div className="space-y-2 w-full">
            <Label htmlFor="category">
              Category <span className="text-red-600">*</span>
            </Label>
            <Select
              name="category_id"
              defaultValue={data?.category_id?.toString() || ""}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    categories.length === 0
                      ? "No categories available"
                      : "Select a category"
                  }
                />
              </SelectTrigger>
              <SelectContent className="w-full">
                {categories.map((category: Category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name} ({category.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Select category for this product
            </p>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Product Name <span className="text-red-600">*</span>
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
              Display name for the product
            </p>
          </div>
        </div>

        {/* Price Field */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="default_price">
              Default Price <span className="text-red-600">*</span>
            </Label>
            <Input
              id="default_price"
              name="default_price"
              type="text"
              placeholder="e.g., Rp 50,000"
              required
              value={formattedPrice}
              onChange={handlePriceChange}
            />
            <input
              type="hidden"
              name="default_price_numeric"
              value={getNumericValue(formattedPrice)}
            />
            <p className="text-xs text-gray-500">Base price for this product</p>
          </div>

          {/* Status Field */}
          <div className="space-y-2 w-full">
            <Label htmlFor="status">
              Status <span className="text-red-600">*</span>
            </Label>
            <Select
              name="status"
              defaultValue={data?.status || "active"}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Product availability status</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link href="/dashboard/products">
          <Button variant="outline">Cancel</Button>
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}

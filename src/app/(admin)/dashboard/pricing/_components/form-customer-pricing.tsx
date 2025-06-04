"use client";

import { AlertCircle, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ActionResult } from "@/types";
import { useActionState } from "react";
import {
  postCustomProductPricing,
  updateCustomerPricing,
  getCustomers,
  getProducts,
  getPricingCount,
} from "../lib/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFormStatus } from "react-dom";
import { Customer, CustomProductPricing, Product } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
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

interface CustomerData extends Customer {
  custom_prices: (CustomProductPricing & {
    product: Product & {
      category: { name: string };
    };
  })[];
}

interface CustomerItem {
  id: number;
  code: string;
  name: string;
}

interface ProductItem {
  id: number;
  code: string;
  name: string;
  default_price: number;
}

interface PricingItem {
  id?: number; // For existing records
  product_id: number;
  custom_price: number;
  formattedPrice: string; // For display
}

interface FormCustomerPricingProps {
  type?: "create" | "update";
  customerData?: CustomerData | null;
}

// Submit button for the form
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Save className="w-4 h-4 mr-1" />
      {pending ? "Saving..." : "Save Customer Pricing"}
    </Button>
  );
}

// Form component for customer pricing
export default function FormCustomerPricing({
  type = "create",
  customerData = null,
}: FormCustomerPricingProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [pricingCode, setPricingCode] = useState<string>("");
  const [pricingItems, setPricingItems] = useState<PricingItem[]>([
    { product_id: 0, custom_price: 0, formattedPrice: "" },
  ]);

  // Generate pricing code function
  const generatePricingCode = async (): Promise<string> => {
    try {
      // Fetch count from actions
      const count = await getPricingCount();
      const nextNumber = count + 1;
      const formattedNumber = nextNumber.toString().padStart(3, "0");
      return `PRC-${formattedNumber}`;
    } catch (error) {
      // Fallback jika terjadi error
      const timestamp = Date.now();
      const codeNumber = timestamp % 1000;
      const formattedNumber = codeNumber.toString().padStart(3, "0");
      return `PRC-${formattedNumber}`;
    }
  };

  // Use form loading hook
  const {
    isLoading,
    loadingProgress,
    error: loadingError,
    data: loadedData,
    generatedCode,
  } = useFormLoading({
    dependencies: [getCustomers, getProducts],
    ...(type === "create" &&
      !pricingCode && { autoGenerateCode: generatePricingCode }),
    skipLoading: false, // Always load dependencies for pricing
  });

  // Extract customers and products from loaded data
  const customers: CustomerItem[] = loadedData[0] || [];
  const products: ProductItem[] = loadedData[1] || [];

  // Set generated code when available
  useEffect(() => {
    if (generatedCode && type === "create" && !pricingCode) {
      setPricingCode(generatedCode);
    }
  }, [generatedCode, type, pricingCode]);

  // Initialize form data for update mode
  useEffect(() => {
    if (type === "update" && customerData && !isLoading) {
      setSelectedCustomer(customerData.id.toString());
      setPricingCode(customerData.custom_prices[0]?.code?.split("-")[0] || "");

      // Map existing custom prices to pricing items
      const existingItems = customerData.custom_prices.map((pricing) => ({
        id: pricing.id,
        product_id: pricing.product_id,
        custom_price: pricing.custom_price,
        formattedPrice: formatToRupiah(pricing.custom_price.toString()),
      }));

      setPricingItems(
        existingItems.length > 0
          ? existingItems
          : [{ product_id: 0, custom_price: 0, formattedPrice: "" }]
      );
    }
  }, [type, customerData, isLoading]);

  // State and form action for customer pricing
  const [state, formAction] = useActionState(
    type === "create" ? postCustomProductPricing : updateCustomerPricing,
    initialState
  );

  // Add new pricing item
  const addPricingItem = () => {
    setPricingItems([
      ...pricingItems,
      { product_id: 0, custom_price: 0, formattedPrice: "" },
    ]);
  };

  // Remove pricing item
  const removePricingItem = (index: number) => {
    if (pricingItems.length > 1) {
      setPricingItems(pricingItems.filter((_, i) => i !== index));
    }
  };

  // Handle price input change with formatting
  const handlePriceChange = (index: number, value: string) => {
    const formatted = handlePriceInputChange(value);
    const numericValue = getNumericValue(formatted);

    const updatedItems = [...pricingItems];
    const currentItem = updatedItems[index];
    if (currentItem) {
      updatedItems[index] = {
        ...currentItem,
        formattedPrice: formatted,
        custom_price: numericValue,
      };
      setPricingItems(updatedItems);
    }
  };

  // Set default price when product is selected
  const handleProductSelect = (index: number, productId: string) => {
    const productIdNum = parseInt(productId);
    const selectedProduct = products.find((p) => p.id === productIdNum);

    // Update the pricing item with new product_id
    const updatedItems = [...pricingItems];
    const currentItem = updatedItems[index];
    if (currentItem) {
      updatedItems[index] = {
        ...currentItem,
        product_id: productIdNum,
        custom_price: selectedProduct?.default_price || 0,
        formattedPrice: selectedProduct
          ? formatToRupiah(selectedProduct.default_price.toString())
          : "",
      };
      setPricingItems(updatedItems);
    }
  };

  // Get available products for a specific index (excluding already selected products)
  const getAvailableProducts = (currentIndex: number) => {
    const selectedProductIds = pricingItems
      .map((item, index) => (index !== currentIndex ? item.product_id : null))
      .filter((id) => id !== null && id > 0);

    return products.filter(
      (product) => !selectedProductIds.includes(product.id)
    );
  };

  // Calculate total for all pricing items
  const totalAmount = pricingItems.reduce(
    (sum, item) => sum + item.custom_price,
    0
  );

  // Show loading state
  if (isLoading) {
    return (
      <FormLoading
        loadingProgress={loadingProgress}
        title="Preparing Pricing Form"
        description="Loading customers, products, and generating pricing code..."
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
      {/* Hidden field for customer_id */}
      <input type="hidden" name="customer_id" value={selectedCustomer} />

      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Customer Pricing Information
        </h2>

        {state.error !== "" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pricing Code Field */}
          <div className="space-y-2">
            <Label htmlFor="code">
              Pricing Code <span className="text-red-600">*</span>
            </Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="e.g., PRC-001"
              required
              value={pricingCode}
              onChange={(e) => setPricingCode(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Unique identifier for the custom pricing
            </p>
          </div>

          {/* Customer Field */}
          <div className="space-y-2 w-full">
            <Label htmlFor="customer_id">
              Customer <span className="text-red-600">*</span>
            </Label>
            <Select
              name="customer_id"
              value={selectedCustomer}
              onValueChange={setSelectedCustomer}
              disabled={type === "update"}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    customers.length === 0
                      ? "No customers available"
                      : "Select a customer"
                  }
                />
              </SelectTrigger>
              <SelectContent className="w-full">
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.name} ({customer.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {type === "update"
                ? "Customer cannot be changed for existing pricing"
                : "Choose the customer for custom pricing"}
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Items Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Product Pricing
          </h3>
          <Button type="button" onClick={addPricingItem} variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Product
          </Button>
        </div>

        <div className="space-y-4">
          {pricingItems.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Product #{index + 1}
                </span>
                {pricingItems.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removePricingItem(index)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Selection */}
                <div className="space-y-2 w-full">
                  <Label htmlFor={`product-${index}`}>
                    Product <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    name={`pricing_items[${index}].product_id`}
                    value={item.product_id.toString()}
                    onValueChange={(value) => handleProductSelect(index, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select product..." />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {getAvailableProducts(index).map((product) => (
                        <SelectItem
                          key={product.id}
                          value={product.id.toString()}
                        >
                          {product.name} (Default:{" "}
                          {formatToRupiah(product.default_price.toString())})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Price */}
                <div className="space-y-2">
                  <Label htmlFor={`price-${index}`}>
                    Custom Price <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id={`price-${index}`}
                    type="text"
                    placeholder="e.g., Rp 50,000"
                    required
                    value={item.formattedPrice}
                    onChange={(e) => handlePriceChange(index, e.target.value)}
                  />
                  <input
                    type="hidden"
                    name={`pricing_items[${index}].custom_price`}
                    value={item.custom_price}
                  />
                  {/* Hidden input for existing record ID */}
                  {item.id && (
                    <input
                      type="hidden"
                      name={`pricing_items[${index}].id`}
                      value={item.id}
                    />
                  )}
                  <p className="text-xs text-gray-500">
                    Special price for this customer
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Total Custom Pricing:
            </span>
            <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
              {formatToRupiah(totalAmount.toString())}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link href="/dashboard/pricing">
          <Button variant="outline">Cancel</Button>
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}

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
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [pricingCode, setPricingCode] = useState<string>("");
  const [pricingItems, setPricingItems] = useState<PricingItem[]>([
    { product_id: 0, custom_price: 0, formattedPrice: "" },
  ]);

  // Generate pricing code function
  const generatePricingCode = async () => {
    try {
      // Fetch count from actions
      const count = await getPricingCount();
      const nextNumber = count + 1;
      const formattedNumber = nextNumber.toString().padStart(3, "0");
      const generatedCode = `PRC-${formattedNumber}`;
      setPricingCode(generatedCode);
    } catch (error) {
      // Fallback jika terjadi error
      const timestamp = Date.now();
      const codeNumber = timestamp % 1000;
      const formattedNumber = codeNumber.toString().padStart(3, "0");
      const generatedCode = `PRC-${formattedNumber}`;
      setPricingCode(generatedCode);
    }
  };

  // State and form action for customer pricing
  const [state, formAction] = useActionState(
    type === "create" ? postCustomProductPricing : updateCustomerPricing,
    initialState
  );

  // Fetch customers and products on component mount, then initialize form data
  useEffect(() => {
    const fetchData = async () => {
      const [customersData, productsData] = await Promise.all([
        getCustomers(),
        getProducts(),
      ]);
      setCustomers(customersData);
      setProducts(productsData);

      // Auto generate pricing code for create mode
      if (type === "create" && !pricingCode) {
        generatePricingCode();
      }

      // Initialize form data for update mode after products are loaded
      if (type === "update" && customerData) {
        setSelectedCustomer(customerData.id.toString());
        setPricingCode(
          customerData.custom_prices[0]?.code?.split("-")[0] || ""
        );

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
    };
    fetchData();
  }, [type, customerData]);

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
      const defaultPrice = selectedProduct?.default_price || 0;
      const shouldUseDefaultPrice =
        currentItem.custom_price === 0 && selectedProduct;

      updatedItems[index] = {
        ...currentItem,
        product_id: productIdNum,
        custom_price: shouldUseDefaultPrice
          ? defaultPrice
          : currentItem.custom_price,
        formattedPrice: shouldUseDefaultPrice
          ? formatToRupiah(defaultPrice.toString())
          : currentItem.formattedPrice,
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

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden fields for form data */}
      <input type="hidden" name="customer_id" value={selectedCustomer} />
      <input type="hidden" name="form_type" value={type} />
      <input type="hidden" name="code" value={pricingCode} />
      {type === "update" && customerData && (
        <input type="hidden" name="customer_data_id" value={customerData.id} />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Customer Pricing Information
        </h2>

        {state.error !== "" && (
          <Alert variant="destructive" className="">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* Customer Field - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="customer_id">
              Customer <span className="text-red-600">*</span>
            </Label>
            {type === "update" ? (
              <div className="flex items-center h-10 px-3 py-2 text-sm border rounded-md bg-gray-50 dark:bg-gray-700 w-full">
                {customerData?.name}
              </div>
            ) : (
              <Select
                name="customer_id"
                value={selectedCustomer}
                onValueChange={setSelectedCustomer}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {customers.map((customer, index) => (
                    <SelectItem
                      key={customer.id}
                      value={customer.id.toString()}
                    >
                      {index + 1}. {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <p className="text-xs text-gray-500">
              {type === "update"
                ? "Customer cannot be changed"
                : "Choose the customer for this pricing"}
            </p>
          </div>
        </div>

        {/* Pricing Items Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium text-gray-900 dark:text-white">
              Product Pricing <span className="text-red-600">*</span>
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPricingItem}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>

          {pricingItems.map((item, index) => (
            <div
              key={`pricing-item-${index}-${item.product_id}-${
                item.id || "new"
              }`}
              className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product #{index + 1}
                </h4>
                {pricingItems.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removePricingItem(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {/* Product Selection - Full Width */}
                <div className="space-y-2">
                  <Label htmlFor={`product-${index}`}>
                    Product <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    key={`product-select-${index}-${item.product_id}`}
                    name={`product_items[${index}].product_id`}
                    value={
                      item.product_id > 0 ? item.product_id.toString() : ""
                    }
                    onValueChange={(value) => handleProductSelect(index, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {getAvailableProducts(index).map(
                        (product) => (
                          <SelectItem
                            key={product.id}
                            value={product.id.toString()}
                          >
                            {product.name} - Rp{" "}
                            {product.default_price.toLocaleString("id-ID")}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Price - Full Width with Currency Format */}
                <div className="space-y-2">
                  <Label htmlFor={`price-${index}`}>
                    Custom Price <span className="text-red-600">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      Rp
                    </span>
                    <Input
                      id={`price-display-${index}`}
                      type="text"
                      placeholder="e.g., 100,000"
                      value={item.formattedPrice}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      className="pl-8 w-full"
                    />
                    {/* Hidden input untuk nilai numerik yang akan dikirim ke server */}
                    <input
                      type="hidden"
                      name={`product_items[${index}].custom_price`}
                      value={item.custom_price}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Price in Indonesian Rupiah (e.g., 100,000)
                  </p>
                </div>
              </div>

              {/* Hidden field for existing item ID in update mode */}
              {type === "update" && item.id && (
                <input
                  type="hidden"
                  name={`product_items[${index}].id`}
                  value={item.id}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href={
            type === "update" && customerData
              ? `/dashboard/pricing/customer/${customerData.id}`
              : "/dashboard/pricing"
          }
        >
          <Button variant="outline">Cancel</Button>
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}

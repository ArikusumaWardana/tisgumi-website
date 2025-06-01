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
    { product_id: 0, custom_price: 0 },
  ]);

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
        }));

        setPricingItems(
          existingItems.length > 0
            ? existingItems
            : [{ product_id: 0, custom_price: 0 }]
        );
      }
    };
    fetchData();
  }, [type, customerData]);

  // Add new pricing item
  const addPricingItem = () => {
    setPricingItems([...pricingItems, { product_id: 0, custom_price: 0 }]);
  };

  // Remove pricing item
  const removePricingItem = (index: number) => {
    if (pricingItems.length > 1) {
      setPricingItems(pricingItems.filter((_, i) => i !== index));
    }
  };

  // Update pricing item
  const updatePricingItem = (
    index: number,
    field: keyof PricingItem,
    value: number
  ) => {
    const updatedItems = [...pricingItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setPricingItems(updatedItems);
  };

  // Set default price when product is selected
  const handleProductSelect = (index: number, productId: string) => {
    const productIdNum = parseInt(productId);
    const selectedProduct = products.find((p) => p.id === productIdNum);

    // Update the pricing item with new product_id
    const updatedItems = [...pricingItems];
    updatedItems[index] = {
      ...updatedItems[index],
      product_id: productIdNum,
      // Only set default price if current custom_price is 0 or empty
      custom_price:
        updatedItems[index].custom_price === 0 && selectedProduct
          ? selectedProduct.default_price
          : updatedItems[index].custom_price,
    };
    setPricingItems(updatedItems);
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden fields for form data */}
      <input type="hidden" name="customer_id" value={selectedCustomer} />
      <input type="hidden" name="form_type" value={type} />
      {type === "update" && customerData && (
        <>
          <input
            type="hidden"
            name="customer_data_id"
            value={customerData.id}
          />
          <input type="hidden" name="pricing_code" value={pricingCode} />
        </>
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
              placeholder="e.g., PRICING-001"
              required
              value={pricingCode}   
              onChange={(e) => setPricingCode(e.target.value)}
              disabled={type === "update"}
            />
            <p className="text-xs text-gray-500">
              {type === "update"
                ? "Pricing code cannot be changed"
                : "Unique identifier for the pricing configuration"}
            </p>
          </div>

          {/* Customer Field */}
          <div className="space-y-2">
            <Label htmlFor="customer_id">
              Customer <span className="text-red-600">*</span>
            </Label>
            {type === "update" ? (
              <div className="flex items-center h-10 px-3 py-2 text-sm border rounded-md bg-gray-50 dark:bg-gray-700">
                {customerData?.name} ({customerData?.code})
              </div>
            ) : (
              <Select
                name="customer_id"
                value={selectedCustomer}
                onValueChange={setSelectedCustomer}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem
                      key={customer.id}
                      value={customer.id.toString()}
                    >
                      {customer.name} ({customer.code})
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Selection */}
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem
                          key={product.id}
                          value={product.id.toString()}
                        >
                          {product.name} ({product.code}) - Rp{" "}
                          {product.default_price.toLocaleString()}
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
                    name={`product_items[${index}].custom_price`}
                    type="number"
                    min="0"
                    placeholder="0"
                    value={item.custom_price || ""}
                    onChange={(e) =>
                      updatePricingItem(
                        index,
                        "custom_price",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
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

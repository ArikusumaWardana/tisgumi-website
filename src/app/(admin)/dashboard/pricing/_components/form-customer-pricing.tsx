"use client";

import { AlertCircle, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { ActionResult } from "@/types";
import {
  postCustomProductPricing,
  updateCustomerPricing,
  getCustomers,
  getAllCustomers,
  getProducts,
} from "../lib/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  id?: number;
  product_id: number;
  custom_price: number;
  formattedPrice: string;
}

interface FormCustomerPricingProps {
  type?: "create" | "update";
  customerData?: CustomerData | null;
}

function SubmitButton({
  validItemsCount,
  selectedCustomer,
  isSubmitting,
}: {
  validItemsCount: number;
  selectedCustomer: string;
  isSubmitting: boolean;
}) {
  const isDisabled = isSubmitting || validItemsCount === 0 || !selectedCustomer;

  return (
    <Button type="submit" disabled={isDisabled}>
      {isSubmitting && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      )}
      {!isSubmitting && <Save className="w-4 h-4 mr-1" />}
      {isSubmitting
        ? "Saving..."
        : !selectedCustomer
        ? "Select Customer First"
        : validItemsCount === 0
        ? "Add Products First"
        : "Save Customer Pricing"}
    </Button>
  );
}

export default function FormCustomerPricing({
  type = "create",
  customerData = null,
}: FormCustomerPricingProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [pricingItems, setPricingItems] = useState<PricingItem[]>([
    { product_id: 0, custom_price: 0, formattedPrice: "" },
  ]);

  // Load data on component mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);

        const [customersData, productsData] = await Promise.all([
          type === "create" ? getCustomers() : getAllCustomers(),
          getProducts(),
        ]);

        if (isMounted) {
          setCustomers(customersData);
          setProducts(productsData);

          // Initialize data for update mode
          if (type === "update" && customerData) {
            setSelectedCustomer(customerData.id.toString());
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
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load data");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [type, customerData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (isSubmitting) {
        return false;
      }

      try {
        setIsSubmitting(true);
        setError("");

        const formData = new FormData(e.currentTarget);

        let result: ActionResult;
        if (type === "create") {
          result = await postCustomProductPricing(null, formData);
        } else {
          result = await updateCustomerPricing(null, formData);
        }

        if (result.error) {
          setError(result.error);
          return false;
        }

        if (result.success) {
          // Redirect after successful submission
          window.location.href = "/dashboard/pricing";
          return false;
        }
      } catch (err) {
        console.error("Form submission error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsSubmitting(false);
      }

      return false;
    },
    [type, isSubmitting]
  );

  const addPricingItem = useCallback(() => {
    setPricingItems((prev) => [
      ...prev,
      { product_id: 0, custom_price: 0, formattedPrice: "" },
    ]);
  }, []);

  const removePricingItem = useCallback((index: number) => {
    setPricingItems((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev
    );
  }, []);

  const handlePriceChange = useCallback((index: number, value: string) => {
    const formatted = handlePriceInputChange(value);
    const numericValue = getNumericValue(formatted);

    setPricingItems((prev) => {
      const updatedItems = [...prev];
      if (updatedItems[index]) {
        updatedItems[index] = {
          ...updatedItems[index],
          formattedPrice: formatted,
          custom_price: numericValue,
        };
      }
      return updatedItems;
    });
  }, []);

  const handleProductSelect = useCallback(
    (index: number, productId: string) => {
      const productIdNum = parseInt(productId);
      const selectedProduct = products.find((p) => p.id === productIdNum);

      setPricingItems((prev) => {
        const updatedItems = [...prev];
        if (updatedItems[index]) {
          updatedItems[index] = {
            ...updatedItems[index],
            product_id: productIdNum,
            custom_price: selectedProduct?.default_price || 0,
            formattedPrice: selectedProduct
              ? formatToRupiah(selectedProduct.default_price.toString())
              : "",
          };
        }
        return updatedItems;
      });
    },
    [products]
  );

  const getAvailableProducts = useCallback(
    (currentIndex: number) => {
      const selectedProductIds = pricingItems
        .map((item, index) => (index !== currentIndex ? item.product_id : null))
        .filter((id): id is number => id !== null && id > 0);

      return products.filter(
        (product) => !selectedProductIds.includes(product.id)
      );
    },
    [products, pricingItems]
  );

  const validPricingItems = useMemo(
    () =>
      pricingItems.filter(
        (item) => item.product_id > 0 && item.custom_price >= 0
      ),
    [pricingItems]
  );

  const emptyItemsCount = pricingItems.length - validPricingItems.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  if (error && !customers.length && !products.length) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" method="post" action="">
      {/* Hidden fields for update mode */}
      {type === "update" && (
        <input type="hidden" name="customer_data_id" value={selectedCustomer} />
      )}
      {/* Hidden field for create mode */}
      {type === "create" && (
        <input type="hidden" name="customer_id" value={selectedCustomer} />
      )}

      {/* Hidden fields for valid pricing items only */}
      {validPricingItems.map((item, validIndex) => (
        <div key={`valid-item-${validIndex}`}>
          <input
            type="hidden"
            name={`pricing_items[${validIndex}].product_id`}
            value={item.product_id}
          />
          <input
            type="hidden"
            name={`pricing_items[${validIndex}].custom_price`}
            value={item.custom_price}
          />
          {item.id && (
            <input
              type="hidden"
              name={`pricing_items[${validIndex}].id`}
              value={item.id}
            />
          )}
        </div>
      ))}

      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Customer Pricing Information
        </h2>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Customer validation alert */}
        {type === "create" && !selectedCustomer && (
          <Alert
            variant="default"
            className="border-yellow-200 bg-yellow-50 text-yellow-800"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please select a customer to continue setting up custom pricing.
            </AlertDescription>
          </Alert>
        )}

        {/* Empty items validation alert */}
        {emptyItemsCount > 0 && (
          <Alert
            variant="default"
            className="border-yellow-200 bg-yellow-50 text-yellow-800"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {emptyItemsCount} empty product item
              {emptyItemsCount > 1 ? "s" : ""} will be ignored when saving the
              pricing. Only {validPricingItems.length} valid item
              {validPricingItems.length !== 1 ? "s" : ""} will be saved.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-4">
          {/* Customer Field */}
          <div className="space-y-2 w-full">
            <Label htmlFor="customer_id">
              Customer <span className="text-red-600">*</span>
            </Label>
            <Select
              name={type === "create" ? "customer_select" : "customer_display"}
              value={selectedCustomer}
              onValueChange={setSelectedCustomer}
              disabled={type === "update" || isSubmitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    type === "update" && customerData
                      ? customerData.name
                      : customers.length === 0
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
          <Button
            type="button"
            onClick={addPricingItem}
            variant="outline"
            disabled={isSubmitting}
          >
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
                    disabled={isSubmitting}
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
                    name={`product-${index}`}
                    value={item.product_id ? item.product_id.toString() : ""}
                    onValueChange={(value) => handleProductSelect(index, value)}
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500">
                    Special price for this customer
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link href="/dashboard/pricing">
          <Button variant="outline" type="button" disabled={isSubmitting}>
            Cancel
          </Button>
        </Link>
        <SubmitButton
          validItemsCount={validPricingItems.length}
          selectedCustomer={selectedCustomer}
          isSubmitting={isSubmitting}
        />
      </div>
    </form>
  );
}

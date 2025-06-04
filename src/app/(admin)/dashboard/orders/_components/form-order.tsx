"use client";

import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ActionResult } from "@/types";
import { useActionState } from "react";
import {
  createOrder,
  generateOrderCode,
  getCustomerProductPrice,
} from "../lib/actions";
import { getCustomersForSelect } from "../../customers/lib/actions";
import { getProductsForSelect } from "../../products/lib/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFormStatus } from "react-dom";
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

interface Customer {
  id: number;
  code: string;
  name: string;
}

interface Product {
  id: number;
  code: string;
  name: string;
  default_price: number;
}

interface OrderItem {
  product_id: number;
  quantity: number;
  price: number; // calculated price (custom or default)
}

// Submit button component
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Order"}
    </Button>
  );
}

// Form component for creating orders
export default function FormOrder() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [orderCode, setOrderCode] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("belum_lunas");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { product_id: 0, quantity: 1, price: 0 },
  ]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [usingFallback, setUsingFallback] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] =
    useState<string>("Initializing...");

  // State for form action
  const [state, formAction] = useActionState(createOrder, initialState);

  // Fetch customers, products, and generate order code on component mount
  useEffect(() => {
    const fetchData = async () => {
      let attemptCount = 0;
      const maxAttempts = 3;

      while (attemptCount < maxAttempts) {
        try {
          attemptCount++;
          setLoadingProgress(
            `Loading data (attempt ${attemptCount}/${maxAttempts})...`
          );

          // Try server actions first
          const [customersData, productsData, newOrderCode] = await Promise.all(
            [
              getCustomersForSelect(),
              getProductsForSelect(),
              generateOrderCode(),
            ]
          );

          setLoadingProgress("Validating data...");

          // Validate that we got proper data
          const isValidCustomers =
            Array.isArray(customersData) && customersData.length > 0;
          const isValidProducts =
            Array.isArray(productsData) && productsData.length > 0;
          const isValidOrderCode =
            typeof newOrderCode === "string" && newOrderCode.length > 0;

          if (isValidCustomers && isValidProducts && isValidOrderCode) {
            setLoadingProgress("Setting up form...");
            setCustomers(customersData);
            setProducts(productsData);
            setOrderCode(newOrderCode);
            break; // Success, exit loop
          } else {
            throw new Error("Invalid data received from server actions");
          }
        } catch (error) {
          console.error(
            `Server actions failed (attempt ${attemptCount}):`,
            error
          );

          // If this is not the last attempt, try fallback
          if (attemptCount < maxAttempts) {
            try {
              setLoadingProgress("Trying backup method...");

              const [customersResponse, productsResponse] = await Promise.all([
                fetch("/api/customers"),
                fetch("/api/products"),
              ]);

              if (!customersResponse.ok || !productsResponse.ok) {
                throw new Error("API routes failed");
              }

              setLoadingProgress("Processing backup data...");

              const [customersData, productsData] = await Promise.all([
                customersResponse.json(),
                productsResponse.json(),
              ]);

              // Validate API data
              const isValidCustomers =
                Array.isArray(customersData) && customersData.length > 0;
              const isValidProducts =
                Array.isArray(productsData) && productsData.length > 0;

              if (isValidCustomers && isValidProducts) {
                setLoadingProgress("Finalizing setup...");
                setCustomers(customersData);
                setProducts(productsData);

                // Generate fallback order code
                const fallbackCode = `ORD-${Date.now().toString().slice(-6)}`;
                setOrderCode(fallbackCode);
                setUsingFallback(true);

                break; // Success, exit loop
              } else {
                throw new Error("Invalid data received from API routes");
              }
            } catch (fallbackError) {
              console.error("API routes fallback also failed:", fallbackError);

              // If this is the last attempt, set empty data
              if (attemptCount === maxAttempts) {
                setLoadingProgress("Loading failed, using minimal setup...");
                console.warn("All loading attempts failed, using empty data");
                setCustomers([]);
                setProducts([]);
                setOrderCode(`ORD-${Date.now().toString().slice(-6)}`);
                setUsingFallback(true);
              }
            }
          }
        }

        // Add delay between attempts
        if (attemptCount < maxAttempts) {
          setLoadingProgress(
            `Retrying in 1 second (${attemptCount}/${maxAttempts})...`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      setIsLoading(false);
    };

    // Start loading with initial delay
    const timer = setTimeout(fetchData, 200);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state - wait until ALL data is ready
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96"></div>
        </div>

        {/* Form Container Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-6">
          {/* Form Title Skeleton */}
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>

          {/* Form Fields Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Order Code Field */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            {/* Customer Field */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            {/* Payment Status Field */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Order Items Section Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
              <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
            </div>

            {/* Order Item Card Skeleton */}
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-16"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-16"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-16"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-20"></div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Total Amount Skeleton */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="h-5 bg-blue-200 dark:bg-blue-700 rounded animate-pulse w-24"></div>
                <div className="h-6 bg-blue-200 dark:bg-blue-700 rounded animate-pulse w-32"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex items-center justify-end gap-3">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-28"></div>
        </div>

        {/* Loading Status */}
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">{loadingProgress}</span>
          </div>
        </div>
      </div>
    );
  }

  // Add new order item
  const addOrderItem = () => {
    setOrderItems([...orderItems, { product_id: 0, quantity: 1, price: 0 }]);
    setSelectedProducts([...selectedProducts, ""]);
  };

  // Remove order item
  const removeOrderItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
      setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
    }
  };

  // Update order item
  const updateOrderItem = (
    index: number,
    field: keyof OrderItem,
    value: number
  ) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    } as OrderItem;
    setOrderItems(updatedItems);
  };

  // Handle product selection and fetch custom pricing
  const handleProductSelect = async (index: number, productId: string) => {
    const productIdNum = parseInt(productId);

    // Ensure products array exists before using find
    const selectedProduct =
      products && Array.isArray(products)
        ? products.find((p) => p.id === productIdNum)
        : null;

    // Update selected products state
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index] = productId;
    setSelectedProducts(newSelectedProducts);

    if (!selectedProduct || !selectedCustomer) {
      updateOrderItem(index, "product_id", productIdNum);
      return;
    }

    try {
      // Get price for this customer and product using server action
      const price = await getCustomerProductPrice(
        parseInt(selectedCustomer),
        productIdNum
      );

      // Update the order item
      const updatedItems = [...orderItems];
      updatedItems[index] = {
        ...updatedItems[index],
        product_id: productIdNum,
        price: price,
      } as OrderItem;
      setOrderItems(updatedItems);
    } catch (error) {
      console.error("Error fetching price:", error);
      updateOrderItem(index, "product_id", productIdNum);
    }
  };

  // Handle customer selection - update prices for existing products
  const handleCustomerSelect = async (customerId: string) => {
    setSelectedCustomer(customerId);

    // Update prices for all selected products when customer changes
    if (
      customerId &&
      orderItems &&
      Array.isArray(orderItems) &&
      orderItems.some((item) => item.product_id > 0)
    ) {
      try {
        const updatedItems = await Promise.all(
          orderItems.map(async (item) => {
            if (item.product_id > 0) {
              try {
                const price = await getCustomerProductPrice(
                  parseInt(customerId),
                  item.product_id
                );
                return { ...item, price };
              } catch (error) {
                console.error("Error fetching price:", error);
                return item; // Return item without price update
              }
            }
            return item;
          })
        );
        setOrderItems(updatedItems);
      } catch (error) {
        console.error("Error updating prices:", error);
      }
    }
  };

  // Calculate total amount
  const totalAmount = (orderItems || []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Get available products for a specific index (excluding already selected products)
  const getAvailableProducts = (currentIndex: number) => {
    // Ensure products is always an array
    if (!products || !Array.isArray(products)) {
      return [];
    }

    // Ensure selectedProducts is always an array
    if (!selectedProducts || !Array.isArray(selectedProducts)) {
      return products;
    }

    const selectedProductIds = selectedProducts
      .map((productId, index) =>
        index !== currentIndex ? parseInt(productId) : null
      )
      .filter((id) => id !== null && id > 0);

    const result = products.filter(
      (product) => !selectedProductIds.includes(product.id)
    );

    return result;
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden field for customer_id */}
      <input type="hidden" name="customer_id" value={selectedCustomer} />
      {/* Hidden field for payment status */}
      <input type="hidden" name="payment_status" value={paymentStatus} />

      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Order Information
        </h2>

        {state.error !== "" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {usingFallback && (
          <Alert
            variant="default"
            className="border-yellow-200 bg-yellow-50 text-yellow-800"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Loading data using fallback mode due to server action issues. Some
              features might be limited. Try refreshing the page for full
              functionality.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Order Code Field */}
          <div className="space-y-2">
            <Label htmlFor="code">
              Order Code <span className="text-red-600">*</span>
            </Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="e.g., ORD-001"
              required
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Unique identifier for the order
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
              onValueChange={handleCustomerSelect}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {(customers || []).map((customer, index) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {index + 1}. {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Choose the customer for this order
            </p>
          </div>

          {/* Payment Status Field */}
          <div className="space-y-2 w-full">
            <Label htmlFor="payment_status">
              Payment Status <span className="text-red-600">*</span>
            </Label>
            <Select
              name="payment_status"
              value={paymentStatus}
              onValueChange={setPaymentStatus}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select payment status" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="lunas">Lunas (Paid)</SelectItem>
                <SelectItem value="belum_lunas">
                  Belum Lunas (Unpaid)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {paymentStatus === "lunas"
                ? "Payment date will be recorded automatically"
                : "Payment date will be empty until marked as paid"}
            </p>
          </div>
        </div>

        {/* Order Items Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium text-gray-900 dark:text-white">
              Order Items
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOrderItem}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {(orderItems || []).map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Item #{index + 1}
                  </span>
                  {orderItems && orderItems.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOrderItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Product Selection */}
                  <div className="space-y-2 w-full">
                    <Label htmlFor={`product-${index}`}>
                      Product <span className="text-red-600">*</span>
                    </Label>
                    <Select
                      key={`product-select-${index}-${item.product_id}`}
                      name={`order_items[${index}].product_id`}
                      value={selectedProducts[index] || ""}
                      onValueChange={(value) =>
                        handleProductSelect(index, value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select product..." />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {(() => {
                          const availableProducts = getAvailableProducts(index);
                          if (
                            !availableProducts ||
                            !Array.isArray(availableProducts)
                          ) {
                            return null;
                          }
                          return availableProducts.map((product) => (
                            <SelectItem
                              key={product.id}
                              value={product.id.toString()}
                            >
                              {product.name}
                            </SelectItem>
                          ));
                        })()}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor={`quantity-${index}`}>
                      Quantity <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id={`quantity-${index}`}
                      name={`order_items[${index}].quantity`}
                      type="number"
                      min="1"
                      placeholder="1"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        updateOrderItem(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                  </div>

                  {/* Price Display */}
                  <div className="space-y-2">
                    <Label>Price per Item</Label>
                    <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded border">
                      <span className="text-sm font-medium">
                        Rp {item.price.toLocaleString()}
                      </span>
                      {item.product_id > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Subtotal: Rp{" "}
                          {(item.price * item.quantity).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Amount */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                Total Amount:
              </span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Rp {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link href="/dashboard/orders">
          <Button variant="outline">Cancel</Button>
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}

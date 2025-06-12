"use client";

import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useCachedFormData } from "@/hooks/use-cached-data";
import Link from "next/link";
import { ActionResult } from "@/types";
import { useActionState } from "react";
import {
  createOrder,
  getCustomerProductPrice,
  generateOrderCode,
} from "../lib/actions";
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

interface OrderItem {
  product_id: number;
  quantity: number;
  price: number; // calculated price (custom or default)
  isCustomPrice: boolean;
}

// Submit button component
function SubmitButton({ validItemsCount }: { validItemsCount: number }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || validItemsCount === 0;

  return (
    <Button type="submit" disabled={isDisabled}>
      {pending
        ? "Creating..."
        : validItemsCount === 0
        ? "Add Items First"
        : "Create Order"}
    </Button>
  );
}

// Form component for creating orders
export default function FormOrder() {
  // Use cached data hook
  const {
    customers,
    products,
    isLoading: isLoadingData,
    usingCache,
  } = useCachedFormData();

  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [orderCode, setOrderCode] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("belum_lunas");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoadingOrderCode, setIsLoadingOrderCode] = useState<boolean>(true);

  // State for form action
  const [state, formAction] = useActionState(createOrder, initialState);

  // Generate order code on component mount
  useEffect(() => {
    const fetchOrderCode = async () => {
      try {
        const generatedOrderCode = await generateOrderCode();

        if (generatedOrderCode && typeof generatedOrderCode === "string") {
          setOrderCode(generatedOrderCode);
        } else {
          // Fallback order code
          setOrderCode(`ORD-${Date.now().toString().slice(-6)}`);
        }
      } catch (error) {
        console.error("Order code generation failed:", error);
        // Fallback order code
        setOrderCode(`ORD-${Date.now().toString().slice(-6)}`);
      }

      setIsLoadingOrderCode(false);
    };

    fetchOrderCode();
  }, []);

  // Show loading state - wait until ALL data is ready
  if (isLoadingData || isLoadingOrderCode) {
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
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex items-center justify-end gap-3">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-600 dark:text-blue-400">
              {isLoadingData
                ? "Loading form data..."
                : "Generating order code..."}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      { product_id: 0, quantity: 1, price: 0, isCustomPrice: false },
    ]);
    setSelectedProducts([...selectedProducts, ""]);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const updateOrderItem = (
    index: number,
    field: keyof OrderItem,
    value: number
  ) => {
    const updatedItems = [...orderItems];
    const currentItem = updatedItems[index] || {
      product_id: 0,
      quantity: 1,
      price: 0,
      isCustomPrice: false,
    };
    updatedItems[index] = {
      ...currentItem,
      [field]: value,
    };
    setOrderItems(updatedItems);
  };

  const handleProductSelect = async (index: number, productId: string) => {
    const productIdNum = parseInt(productId);
    const selectedProduct = products.find((p) => p.id === productIdNum);

    // Update selected products tracking
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index] = productId;
    setSelectedProducts(newSelectedProducts);

    if (selectedProduct && selectedCustomer) {
      // Get the appropriate price (custom or default) for this customer and product
      let finalPrice = selectedProduct.default_price;
      let isCustomPrice = false;

      try {
        const customPrice = await getCustomerProductPrice(
          parseInt(selectedCustomer),
          productIdNum
        );
        if (customPrice && customPrice !== selectedProduct.default_price) {
          finalPrice = customPrice;
          isCustomPrice = true;
        }
      } catch (error) {
        console.error("Error fetching customer product price:", error);
        // Fallback to default price if there's an error
        finalPrice = selectedProduct.default_price;
      }

      const updatedItems = [...orderItems];
      const currentItem = updatedItems[index] || {
        product_id: 0,
        quantity: 1,
        price: 0,
        isCustomPrice: false,
      };
      updatedItems[index] = {
        ...currentItem,
        product_id: productIdNum,
        price: finalPrice,
        isCustomPrice: isCustomPrice,
        quantity: 1, // Reset quantity to 1 when product changes
      };
      setOrderItems(updatedItems);
    } else if (selectedProduct) {
      // If no customer is selected yet, use default price
      const updatedItems = [...orderItems];
      const currentItem = updatedItems[index] || {
        product_id: 0,
        quantity: 1,
        price: 0,
        isCustomPrice: false,
      };
      updatedItems[index] = {
        ...currentItem,
        product_id: productIdNum,
        price: selectedProduct.default_price || 0,
        isCustomPrice: false,
        quantity: 1, // Reset quantity to 1 when product changes
      };
      setOrderItems(updatedItems);
    }
  };

  const handleCustomerSelect = async (customerId: string) => {
    setSelectedCustomer(customerId);

    // Update prices for already selected products when customer changes
    if (customerId && orderItems.length > 0) {
      const updatedItems = [...orderItems];

      for (let i = 0; i < updatedItems.length; i++) {
        const item = updatedItems[i];
        if (item && item.product_id > 0) {
          const selectedProduct = products.find(
            (p) => p.id === item.product_id
          );
          if (selectedProduct) {
            let finalPrice = selectedProduct.default_price;
            let isCustomPrice = false;

            try {
              const customPrice = await getCustomerProductPrice(
                parseInt(customerId),
                item.product_id
              );
              if (
                customPrice &&
                customPrice !== selectedProduct.default_price
              ) {
                finalPrice = customPrice;
                isCustomPrice = true;
              }

              updatedItems[i] = {
                ...item,
                price: finalPrice,
                isCustomPrice: isCustomPrice,
              };
            } catch (error) {
              console.error("Error fetching customer product price:", error);
              // Keep current price if there's an error
            }
          }
        }
      }

      setOrderItems(updatedItems);
    }
  };

  // Filter valid order items (items with selected product and quantity > 0)
  const getValidOrderItems = () => {
    return orderItems.filter(
      (item, index) =>
        item.product_id > 0 &&
        item.quantity > 0 &&
        selectedProducts[index] &&
        selectedProducts[index] !== ""
    );
  };

  const validOrderItems = getValidOrderItems();
  const emptyItemsCount = orderItems.length - validOrderItems.length;

  // Calculate total amount from valid items only
  const totalAmount = validOrderItems.reduce(
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

      {/* Hidden fields for valid order items only */}
      {validOrderItems.map((item, validIndex) => (
        <div key={`valid-item-${validIndex}`}>
          <input
            type="hidden"
            name={`order_items[${validIndex}].product_id`}
            value={item.product_id}
          />
          <input
            type="hidden"
            name={`order_items[${validIndex}].quantity`}
            value={item.quantity}
          />
          <input
            type="hidden"
            name={`order_items[${validIndex}].price`}
            value={item.price}
          />
        </div>
      ))}

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

        {usingCache && (
          <Alert
            variant="default"
            className="border-blue-200 bg-blue-50 text-blue-800"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Using cached data to improve performance. Data may be up to 5
              minutes old.
            </AlertDescription>
          </Alert>
        )}

        {emptyItemsCount > 0 && (
          <Alert
            variant="default"
            className="border-yellow-200 bg-yellow-50 text-yellow-800"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {emptyItemsCount} empty product item
              {emptyItemsCount > 1 ? "s" : ""} will be ignored when creating the
              order. Only {validOrderItems.length} valid item
              {validOrderItems.length !== 1 ? "s" : ""} will be saved.
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
            {orderItems && orderItems.length > 0 ? (
              orderItems.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Item #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOrderItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Product Selection */}
                    <div className="space-y-2 w-full">
                      <Label htmlFor={`product-${index}`}>
                        Product <span className="text-red-600">*</span>
                      </Label>
                      <Select
                        key={`product-select-${index}-${item.product_id}`}
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
                            const availableProducts =
                              getAvailableProducts(index);
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
                        type="number"
                        min="1"
                        placeholder={
                          item.product_id === 0 ? "Select product first" : "1"
                        }
                        value={item.quantity || ""}
                        disabled={item.product_id === 0 || item.price === 0}
                        className={
                          item.product_id === 0 || item.price === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                        onChange={(e) =>
                          updateOrderItem(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                      {(item.product_id === 0 || item.price === 0) && (
                        <p className="text-xs text-gray-500">
                          Select a product first to enable quantity input
                        </p>
                      )}
                    </div>

                    {/* Price Display */}
                    <div className="space-y-2">
                      <Label>Price per Item</Label>
                      <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            Rp {item.price.toLocaleString()}
                          </span>
                          {item.isCustomPrice && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Custom Price
                            </span>
                          )}
                        </div>
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
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="flex flex-col items-center">
                  <Plus className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    No items added yet
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Click &quot;Add Item&quot; to start adding products to this
                    order
                  </p>
                </div>
              </div>
            )}
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
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </Link>
        <SubmitButton validItemsCount={validOrderItems.length} />
      </div>
    </form>
  );
}

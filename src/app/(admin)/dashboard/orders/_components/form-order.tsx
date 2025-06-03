"use client";

import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ActionResult } from "@/types";
import { useActionState } from "react";
import {
  createOrder,
  getCustomers,
  getProducts,
  generateOrderCode,
  getCustomerProductPrice,
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State for form action
  const [state, formAction] = useActionState(createOrder, initialState);

  // Fetch customers, products, and generate order code on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, productsData, newOrderCode] = await Promise.all([
          getCustomers(),
          getProducts(),
          generateOrderCode(),
        ]);
        setCustomers(customersData || []);
        setProducts(productsData || []);
        setOrderCode(newOrderCode || "");
      } catch (error) {
        console.error("Error fetching data:", error);
        setCustomers([]);
        setProducts([]);
        setOrderCode("");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading order form...</p>
        </div>
      </div>
    );
  }

  // Add new order item
  const addOrderItem = () => {
    setOrderItems([...orderItems, { product_id: 0, quantity: 1, price: 0 }]);
  };

  // Remove order item
  const removeOrderItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
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
    const selectedProduct = products.find((p) => p.id === productIdNum);

    if (!selectedProduct || !selectedCustomer) {
      updateOrderItem(index, "product_id", productIdNum);
      return;
    }

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
  };

  // Handle customer selection - update prices for existing products
  const handleCustomerSelect = async (customerId: string) => {
    setSelectedCustomer(customerId);

    // Update prices for all selected products when customer changes
    if (customerId && orderItems.some((item) => item.product_id > 0)) {
      const updatedItems = await Promise.all(
        orderItems.map(async (item) => {
          if (item.product_id > 0) {
            const price = await getCustomerProductPrice(
              parseInt(customerId),
              item.product_id
            );
            return { ...item, price };
          }
          return item;
        })
      );
      setOrderItems(updatedItems);
    }
  };

  // Calculate total amount
  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
          <div className="space-y-2">
            <Label htmlFor="customer_id">
              Customer <span className="text-red-600">*</span>
            </Label>
            <Select
              name="customer_id"
              value={selectedCustomer}
              onValueChange={handleCustomerSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {(customers || []).map((customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.name} ({customer.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Choose the customer for this order
            </p>
          </div>

          {/* Payment Status Field */}
          <div className="space-y-2">
            <Label htmlFor="payment_status">
              Payment Status <span className="text-red-600">*</span>
            </Label>
            <Select
              name="payment_status"
              value={paymentStatus}
              onValueChange={setPaymentStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment status" />
              </SelectTrigger>
              <SelectContent>
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
            {orderItems.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Item #{index + 1}
                  </span>
                  {orderItems.length > 1 && (
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
                  <div className="space-y-2">
                    <Label htmlFor={`product-${index}`}>
                      Product <span className="text-red-600">*</span>
                    </Label>
                    <Select
                      name={`order_items[${index}].product_id`}
                      value={item.product_id.toString()}
                      onValueChange={(value) =>
                        handleProductSelect(index, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {(products || []).map((product) => (
                          <SelectItem
                            key={product.id}
                            value={product.id.toString()}
                          >
                            {product.name} ({product.code})
                          </SelectItem>
                        ))}
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

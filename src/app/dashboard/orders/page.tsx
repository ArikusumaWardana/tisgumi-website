"use client";

import { useState } from "react";
import { Plus, Search, MoreHorizontal, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Mock data - nanti bisa diganti dengan data dari API
const customers = [
  { id: "CUS-001", name: "John Doe" },
  { id: "CUS-002", name: "Jane Smith" },
  { id: "CUS-003", name: "Mike Johnson" },
  { id: "CUS-004", name: "Sarah Wilson" },
];

const products = [
  { id: "PRD-001", name: "Grilled Chicken Rice", price: 32000 },
  { id: "PRD-002", name: "Special Coffee", price: 18000 },
  { id: "PRD-003", name: "Chocolate Cake", price: 25000 },
  { id: "PRD-004", name: "Spring Rolls", price: 15000 },
];

// Mock data untuk orders
const orders = [
  {
    id: "ORD-001",
    customerId: "CUS-001",
    customerName: "John Doe",
    items: [
      {
        productId: "PRD-001",
        productName: "Grilled Chicken Rice",
        quantity: 2,
        price: 32000,
        total: 64000,
      },
      {
        productId: "PRD-002",
        productName: "Special Coffee",
        quantity: 1,
        price: 18000,
        total: 18000,
      },
    ],
    totalAmount: 82000,
    status: "Lunas",
    createdAt: "2024-03-15",
  },
  {
    id: "ORD-002",
    customerId: "CUS-002",
    customerName: "Jane Smith",
    items: [
      {
        productId: "PRD-003",
        productName: "Chocolate Cake",
        quantity: 3,
        price: 25000,
        total: 75000,
      },
    ],
    totalAmount: 75000,
    status: "Belum Lunas",
    createdAt: "2024-03-14",
  },
];

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("belum_lunas");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderItems, setOrderItems] = useState<
    Array<{
      productId: string;
      quantity: string;
      price: number;
      total: number;
    }>
  >([{ productId: "", quantity: "", price: 0, total: 0 }]);

  // Calculate total amount for all items
  const calculateTotalAmount = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  // Handle product selection
  const handleProductChange = (index: number, productId: string) => {
    const selectedProduct = products.find((p) => p.id === productId);
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      productId,
      price: selectedProduct?.price || 0,
      total: selectedProduct?.price
        ? selectedProduct.price * Number(newItems[index].quantity || 0)
        : 0,
    };
    setOrderItems(newItems);
  };

  // Handle quantity change
  const handleQuantityChange = (index: number, quantity: string) => {
    // Prevent negative numbers and convert to positive if negative
    const numQuantity = Math.abs(Number(quantity) || 0);
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      quantity: numQuantity.toString(),
      total: newItems[index].price * numQuantity,
    };
    setOrderItems(newItems);
  };

  // Add new product input
  const addProductInput = () => {
    setOrderItems([
      ...orderItems,
      { productId: "", quantity: "", price: 0, total: 0 },
    ]);
  };

  // Remove product input
  const removeProductInput = (index: number) => {
    const newItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(newItems);
  };

  // Filter orders based on search query and date range
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    const orderDate = new Date(order.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchesDate =
      (!start || orderDate >= start) && (!end || orderDate <= end);

    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage customer orders and transactions
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Plus className="w-4 h-4" />
              Create New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="customer"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Select Customer
                  </label>
                  <select
                    id="customer"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                  >
                    <option value="">Select a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="paymentStatus"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Payment Status
                  </label>
                  <select
                    id="paymentStatus"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                  >
                    <option value="belum_lunas">Belum Lunas</option>
                    <option value="lunas">Lunas</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Order Items</label>
                </div>

                {orderItems.map((item, index) => (
                  <div key={index} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-[1fr,120px,140px] items-start">
                      <div className="space-y-2">
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={item.productId}
                          onChange={(e) =>
                            handleProductChange(index, e.target.value)
                          }
                        >
                          <option value="">Select a product</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (Rp {p.price.toLocaleString("id-ID")})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder="Qty"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            // Prevent negative input
                            const value = e.target.value;
                            if (value === "" || Number(value) >= 0) {
                              handleQuantityChange(index, value);
                            }
                          }}
                          onKeyDown={(e) => {
                            // Prevent minus sign input
                            if (e.key === "-") {
                              e.preventDefault();
                            }
                          }}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="h-10 flex items-center px-3 text-sm text-gray-500 truncate">
                          Rp {item.total.toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>

                    {orderItems.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeProductInput(index)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove Item
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addProductInput}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-sm font-medium">Total Amount:</span>
                  <span className="text-lg font-bold text-[#8e8e4b]">
                    Rp {calculateTotalAmount().toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setSelectedCustomer("");
                    setPaymentStatus("belum_lunas");
                    setOrderItems([
                      { productId: "", quantity: "", price: 0, total: 0 },
                    ]);
                  }}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  Create Order
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-4 space-y-4">
          {/* Search and Date Filter Container */}
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Date Range Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full sm:w-auto flex-1"
                />
              </div>
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <span className="text-gray-500 flex-shrink-0">to</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full sm:w-auto flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Container - Add horizontal scroll for mobile */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.productId} className="text-sm">
                          <span className="font-medium">
                            {item.productName}
                          </span>
                          <span className="text-gray-500">
                            {" "}
                            x {item.quantity}
                          </span>
                          <span className="text-[#8e8e4b] ml-2">
                            (Rp {item.total.toLocaleString("id-ID")})
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    Rp {order.totalAmount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        order.status === "Lunas"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : order.status === "Belum Lunas"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{order.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Search, MoreHorizontal, X } from "lucide-react";
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

// Mock data - nanti bisa diganti dengan data dari API
const customers = [
  { id: "CUS-001", name: "John Doe" },
  { id: "CUS-002", name: "Jane Smith" },
  { id: "CUS-003", name: "Mike Johnson" },
  { id: "CUS-004", name: "Sarah Wilson" },
];

const products = [
  { id: "PRD-001", name: "Grilled Chicken Rice", defaultPrice: 32000 },
  { id: "PRD-002", name: "Special Coffee", defaultPrice: 18000 },
  { id: "PRD-003", name: "Chocolate Cake", defaultPrice: 25000 },
  { id: "PRD-004", name: "Spring Rolls", defaultPrice: 15000 },
];

// Mock data untuk custom pricing
const customPricing = [
  {
    id: "PRC-001",
    customerId: "CUS-001",
    customerName: "John Doe",
    products: [
      {
        productId: "PRD-001",
        productName: "Grilled Chicken Rice",
        customPrice: 35000,
      },
      {
        productId: "PRD-002",
        productName: "Special Coffee",
        customPrice: 20000,
      },
    ],
    createdAt: "2024-03-01",
  },
  {
    id: "PRC-002",
    customerId: "CUS-002",
    customerName: "Jane Smith",
    products: [
      {
        productId: "PRD-003",
        productName: "Chocolate Cake",
        customPrice: 28000,
      },
    ],
    createdAt: "2024-03-01",
  },
];

export default function PricingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customProducts, setCustomProducts] = useState<
    Array<{
      productId: string;
      customPrice: string;
    }>
  >([{ productId: "", customPrice: "" }]);

  // Function to format number to Rupiah format
  const formatToRupiah = (value: string) => {
    const number = value.replace(/\D/g, "");
    return Number(number).toLocaleString("id-ID");
  };

  // Function to handle price input change
  const handlePriceChange = (index: number, value: string) => {
    const newProducts = [...customProducts];
    newProducts[index].customPrice = formatToRupiah(value);
    setCustomProducts(newProducts);
  };

  // Function to add new product input
  const addProductInput = () => {
    setCustomProducts([...customProducts, { productId: "", customPrice: "" }]);
  };

  // Function to remove product input
  const removeProductInput = (index: number) => {
    const newProducts = customProducts.filter((_, i) => i !== index);
    setCustomProducts(newProducts);
  };

  // Filter custom pricing based on search query
  const filteredPricing = customPricing.filter(
    (pricing) =>
      pricing.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pricing.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Custom Pricing Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage custom product prices for specific customers
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Plus className="w-4 h-4" />
              Add New Custom Pricing
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Custom Pricing</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 py-4">
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

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Custom Products</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addProductInput}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                {customProducts.map((product, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={product.productId}
                        onChange={(e) => {
                          const newProducts = [...customProducts];
                          newProducts[index].productId = e.target.value;
                          setCustomProducts(newProducts);
                        }}
                      >
                        <option value="">Select a product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Default: Rp{" "}
                            {p.defaultPrice.toLocaleString("id-ID")})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          Rp
                        </span>
                        <Input
                          type="text"
                          placeholder="Enter custom price"
                          className="w-full pl-10"
                          value={product.customPrice}
                          onChange={(e) =>
                            handlePriceChange(index, e.target.value)
                          }
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                    </div>
                    {customProducts.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-2"
                        onClick={() => removeProductInput(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setSelectedCustomer("");
                    setCustomProducts([{ productId: "", customPrice: "" }]);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Custom Pricing</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Table */}
      <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search custom pricing..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Custom Products</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPricing.map((pricing) => (
              <TableRow key={pricing.id}>
                <TableCell className="font-medium">{pricing.id}</TableCell>
                <TableCell>{pricing.customerName}</TableCell>
                <TableCell>
                  <div className="space-y-2">
                    {pricing.products.map((product) => (
                      <div key={product.productId} className="text-sm">
                        <span className="font-medium">
                          {product.productName}
                        </span>
                        <span className="text-gray-500"> - </span>
                        <span className="text-[#8e8e4b]">
                          Rp {product.customPrice.toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{pricing.createdAt}</TableCell>
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
  );
}

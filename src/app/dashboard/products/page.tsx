"use client";

import { useState } from "react";
import { Plus, Search, MoreHorizontal } from "lucide-react";
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
const products = [
  {
    id: "PRD-001",
    name: "Grilled Chicken Rice",
    category: "Main Course",
    description: "Delicious grilled chicken served with rice and vegetables",
    defaultPrice: 32000,
    status: "Active",
    createdAt: "2024-03-01",
  },
  {
    id: "PRD-002",
    name: "Special Coffee",
    category: "Beverages",
    description: "Premium coffee blend with special recipe",
    defaultPrice: 18000,
    status: "Active",
    createdAt: "2024-03-01",
  },
  {
    id: "PRD-003",
    name: "Chocolate Cake",
    category: "Desserts",
    description: "Rich chocolate cake with chocolate ganache",
    defaultPrice: 25000,
    status: "Active",
    createdAt: "2024-03-01",
  },
  {
    id: "PRD-004",
    name: "Spring Rolls",
    category: "Appetizers",
    description: "Crispy spring rolls with sweet chili sauce",
    defaultPrice: 15000,
    status: "Inactive",
    createdAt: "2024-03-01",
  },
];

// Mock categories for dropdown
const categories = [
  { id: "CAT-001", name: "Main Course" },
  { id: "CAT-002", name: "Appetizers" },
  { id: "CAT-003", name: "Beverages" },
  { id: "CAT-004", name: "Desserts" },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [defaultPrice, setDefaultPrice] = useState("");

  // Function to format number to Rupiah format
  const formatToRupiah = (value: string) => {
    // Remove all non-digit characters
    const number = value.replace(/\D/g, "");

    // Format with thousand separator using toLocaleString
    return Number(number).toLocaleString("id-ID");
  };

  // Function to handle price input change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove all non-digit characters and format
    const formattedValue = formatToRupiah(value);
    setDefaultPrice(formattedValue);
  };

  // Function to get numeric value from formatted string
  const getNumericValue = (formattedValue: string) => {
    return parseInt(formattedValue.replace(/\D/g, "")) || 0;
  };

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Product Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your menu products and items
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Plus className="w-4 h-4" />
              Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 py-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Product Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Category
                </label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Description
                </label>
                <Input
                  id="description"
                  placeholder="Enter product description"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="defaultPrice"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Default Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    Rp
                  </span>
                  <Input
                    id="defaultPrice"
                    type="text"
                    placeholder="Enter default price"
                    className="w-full pl-10"
                    value={defaultPrice}
                    onChange={handlePriceChange}
                    onKeyPress={(e) => {
                      // Only allow numbers
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Status
                </label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setDefaultPrice(""); // Reset price when closing dialog
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    // Here you can use getNumericValue(defaultPrice) to get the actual number
                    console.log(
                      "Numeric value:",
                      getNumericValue(defaultPrice)
                    );
                    // Add your submit logic here
                  }}
                >
                  Add Product
                </Button>
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
              placeholder="Search products..."
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
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Default Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>
                  Rp {product.defaultPrice.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      product.status === "Active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {product.status}
                  </span>
                </TableCell>
                <TableCell>{product.createdAt}</TableCell>
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

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionMenu } from "@/components/ui/action-menu";
import {
  formatToRupiah,
  handlePriceInputChange,
  getNumericValue,
} from "@/utils/currency";

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

  // Function to handle price input change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDefaultPrice(handlePriceInputChange(value));
  };

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: "ID", accessorKey: "id" },
    { header: "Name", accessorKey: "name" },
    { header: "Category", accessorKey: "category" },
    { header: "Description", accessorKey: "description" },
    {
      header: "Default Price",
      accessorKey: "defaultPrice",
      cell: (row: any) => `Rp ${row.defaultPrice.toLocaleString("id-ID")}`,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: any) => <StatusBadge status={row.status} />,
    },
    { header: "Created At", accessorKey: "createdAt" },
    {
      header: "",
      accessorKey: "actions",
      cell: (row: any) => (
        <ActionMenu
          onEdit={() => console.log("Edit", row.id)}
          onView={() => console.log("View", row.id)}
          onDelete={() => console.log("Delete", row.id)}
        />
      ),
    },
  ];

  const addProductForm = (
    <form className="space-y-4 py-4">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Product Name
        </label>
        <Input id="name" placeholder="Enter product name" className="w-full" />
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
            console.log("Numeric value:", getNumericValue(defaultPrice));
            // Add your submit logic here
          }}
        >
          Add Product
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Management"
        description="Manage your menu products and items"
        actionButton={{
          label: "Add New Product",
          icon: <Plus className="w-4 h-4 mr-2" />,
          dialogContent: addProductForm,
        }}
      />

      <DataTable
        columns={columns}
        data={filteredProducts}
        searchPlaceholder="Search products..."
        onSearch={setSearchQuery}
        searchValue={searchQuery}
      />
    </div>
  );
}

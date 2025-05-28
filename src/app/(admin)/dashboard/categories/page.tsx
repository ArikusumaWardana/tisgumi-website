"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionMenu } from "@/components/ui/action-menu";

// Mock data - nanti bisa diganti dengan data dari API
const categories = [
  {
    id: "CAT-001",
    name: "Main Course",
    description: "Main dishes and entrees",
    items: 24,
    status: "Active",
    createdAt: "2024-03-01",
  },
  {
    id: "CAT-002",
    name: "Appetizers",
    description: "Starters and small bites",
    items: 15,
    status: "Active",
    createdAt: "2024-03-01",
  },
  {
    id: "CAT-003",
    name: "Beverages",
    description: "Drinks and refreshments",
    items: 12,
    status: "Active",
    createdAt: "2024-03-01",
  },
  {
    id: "CAT-004",
    name: "Desserts",
    description: "Sweet treats and desserts",
    items: 8,
    status: "Inactive",
    createdAt: "2024-03-01",
  },
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Filter categories based on search query
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: "ID", accessorKey: "id" },
    { header: "Name", accessorKey: "name" },
    { header: "Description", accessorKey: "description" },
    { header: "Items", accessorKey: "items" },
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
          onView={() => console.log("View Items", row.id)}
          onDelete={() => console.log("Delete", row.id)}
        />
      ),
    },
  ];

  const addCategoryForm = (
    <form className="space-y-4 py-4">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Category Name
        </label>
        <Input id="name" placeholder="Enter category name" className="w-full" />
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
          placeholder="Enter category description"
          className="w-full"
        />
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
        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">Add Category</Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Category Management"
        description="Manage your menu categories and items"
        actionButton={{
          label: "Add New Category",
          icon: <Plus className="w-4 h-4 mr-2" />,
          dialogContent: addCategoryForm,
        }}
      />

      <DataTable
        columns={columns}
        data={filteredCategories}
        searchPlaceholder="Search categories..."
        onSearch={setSearchQuery}
        searchValue={searchQuery}
      />
    </div>
  );
}

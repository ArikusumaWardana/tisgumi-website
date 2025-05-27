"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { ActionMenu } from "@/components/ui/action-menu";
import {
  formatToRupiah,
  handlePriceInputChange,
  getNumericValue,
} from "@/utils/currency";

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

  // Function to handle price input change
  const handlePriceChange = (index: number, value: string) => {
    const newProducts = [...customProducts];
    newProducts[index].customPrice = handlePriceInputChange(value);
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

  const columns = [
    { header: "ID", accessorKey: "id" },
    { header: "Customer", accessorKey: "customerName" },
    {
      header: "Custom Products",
      accessorKey: "products",
      cell: (row: any) => (
        <div className="space-y-2">
          {row.products.map((product: any) => (
            <div key={product.productId} className="text-sm">
              <span className="font-medium">{product.productName}</span>
              <span className="text-gray-500"> - </span>
              <span className="text-[#8e8e4b]">
                Rp {product.customPrice.toLocaleString("id-ID")}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    { header: "Created At", accessorKey: "createdAt" },
    {
      header: "",
      accessorKey: "actions",
      cell: (row: any) => (
        <ActionMenu
          onEdit={() => console.log("Edit", row.id)}
          onView={() => console.log("View Details", row.id)}
          onDelete={() => console.log("Delete", row.id)}
        />
      ),
    },
  ];

  const addPricingForm = (
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
                  onChange={(e) => handlePriceChange(index, e.target.value)}
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
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Custom Pricing Management"
        description="Manage custom product prices for specific customers"
        actionButton={{
          label: "Add New Custom Pricing",
          icon: <Plus className="w-4 h-4 mr-2" />,
          dialogContent: addPricingForm,
        }}
      />

      <DataTable
        columns={columns}
        data={filteredPricing}
        searchPlaceholder="Search custom pricing..."
        onSearch={setSearchQuery}
        searchValue={searchQuery}
      />
    </div>
  );
}

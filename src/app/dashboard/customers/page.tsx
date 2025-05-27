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
const customers = [
  {
    id: "CUS-001",
    name: "John Doe",
    phoneNumber: "081234567890",
    status: "Active",
    createdAt: "2024-03-01",
  },
  {
    id: "CUS-002",
    name: "Jane Smith",
    phoneNumber: "089876543210",
    status: "Active",
    createdAt: "2024-03-01",
  },
  {
    id: "CUS-003",
    name: "Mike Johnson",
    phoneNumber: "087812345678",
    status: "Active",
    createdAt: "2024-03-01",
  },
  {
    id: "CUS-004",
    name: "Sarah Wilson",
    phoneNumber: "085678912345",
    status: "Inactive",
    createdAt: "2024-03-01",
  },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Function to format phone number
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const number = value.replace(/\D/g, "");

    // Format phone number (e.g., 0812-3456-7890)
    if (number.length <= 4) return number;
    if (number.length <= 8) return `${number.slice(0, 4)}-${number.slice(4)}`;
    return `${number.slice(0, 4)}-${number.slice(4, 8)}-${number.slice(8, 12)}`;
  };

  // Function to handle phone number input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatPhoneNumber(value);
    setPhoneNumber(formattedValue);
  };

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phoneNumber.includes(searchQuery) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: "ID", accessorKey: "id" },
    { header: "Name", accessorKey: "name" },
    { header: "Phone Number", accessorKey: "phoneNumber" },
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
          onView={() => console.log("View Details", row.id)}
          onDelete={() => console.log("Delete", row.id)}
        />
      ),
    },
  ];

  const addCustomerForm = (
    <form className="space-y-4 py-4">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Customer Name
        </label>
        <Input id="name" placeholder="Enter customer name" className="w-full" />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="phoneNumber"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Phone Number
        </label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="Enter phone number"
          className="w-full"
          value={phoneNumber}
          onChange={handlePhoneChange}
          onKeyPress={(e) => {
            // Only allow numbers
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          maxLength={14} // 4-4-4 format + 2 hyphens
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
        <Button
          variant="outline"
          onClick={() => {
            setIsAddDialogOpen(false);
            setPhoneNumber(""); // Reset phone number when closing dialog
          }}
        >
          Cancel
        </Button>
        <Button type="submit">Add Customer</Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Management"
        description="Manage your customer information"
        actionButton={{
          label: "Add New Customer",
          icon: <Plus className="w-4 h-4 mr-2" />,
          dialogContent: addCustomerForm,
        }}
      />

      <DataTable
        columns={columns}
        data={filteredCustomers}
        searchPlaceholder="Search customers..."
        onSearch={setSearchQuery}
        searchValue={searchQuery}
      />
    </div>
  );
}

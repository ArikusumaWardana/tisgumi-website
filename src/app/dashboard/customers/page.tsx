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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your customer information
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Plus className="w-4 h-4" />
              Add New Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 py-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Customer Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter customer name"
                  className="w-full"
                />
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
              placeholder="Search customers..."
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
              <TableHead>Phone Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      customer.status === "Active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {customer.status}
                  </span>
                </TableCell>
                <TableCell>{customer.createdAt}</TableCell>
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

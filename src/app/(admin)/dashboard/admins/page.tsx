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
const admins = [
  {
    id: "ADM-001",
    name: "John Doe",
    email: "john@tisgumi.com",
    role: "Super Admin",
    status: "Active",
    lastLogin: "2024-03-15 10:30",
  },
  {
    id: "ADM-002",
    name: "Jane Smith",
    email: "jane@tisgumi.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-03-14 15:45",
  },
  {
    id: "ADM-003",
    name: "Mike Johnson",
    email: "mike@tisgumi.com",
    role: "Editor",
    status: "Inactive",
    lastLogin: "2024-03-10 09:15",
  },
];

export default function AdminsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Filter admins based on search query
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: "ID", accessorKey: "id" },
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Role", accessorKey: "role" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: any) => <StatusBadge status={row.status} />,
    },
    { header: "Last Login", accessorKey: "lastLogin" },
    {
      header: "",
      accessorKey: "actions",
      cell: (row: any) => (
        <ActionMenu
          onEdit={() => console.log("Edit", row.id)}
          onDelete={() => console.log("Delete", row.id)}
          customActions={[
            {
              label: "Reset Password",
              onClick: () => console.log("Reset Password", row.id),
            },
          ]}
        />
      ),
    },
  ];

  const addAdminForm = (
    <form className="space-y-4 py-4">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Full Name
        </label>
        <Input id="name" placeholder="Enter full name" className="w-full" />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter email address"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="role"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Role
        </label>
        <select
          id="role"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
        </select>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">Add Admin</Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Management"
        description="Manage your admin accounts and permissions"
        actionButton={{
          label: "Add New Admin",
          icon: <Plus className="w-4 h-4 mr-2" />,
          dialogContent: addAdminForm,
        }}
      />

      <DataTable
        columns={columns}
        data={filteredAdmins}
        searchPlaceholder="Search admins..."
        onSearch={setSearchQuery}
        searchValue={searchQuery}
      />
    </div>
  );
}

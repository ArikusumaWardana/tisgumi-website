import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getCustomers } from "./lib/data";

export default async function CategoriesPage() {
  // Get all customers from the database
  const data = await getCustomers();

  // Return the customers page
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Management"
        description="Manage your customers"
        actionButton={{
          label: "Add New Customer",
          icon: <Plus className="w-4 h-4 mr-2" />,
          href: "/dashboard/customers/create",
        }}
      />

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Search customers..."
      />
    </div>
  );
}

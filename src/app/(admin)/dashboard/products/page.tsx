import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getProducts } from "./lib/data";

export default async function CategoriesPage() {
  // Get all products from the database
  const data = await getProducts();

  // Return the products page
  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Management"
        description="Manage your menu products and items"
        actionButton={{
          label: "Add New Product",
          icon: <Plus className="w-4 h-4 mr-2" />,
          href: "/dashboard/products/create",
        }}
      />

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Search products..."
      />
    </div>
  );
}

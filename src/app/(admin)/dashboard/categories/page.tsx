import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getCategories } from "./lib/data";

export default async function CategoriesPage() {
  // Get all categories from the database
  const data = await getCategories();

  // Return the categories page
  return (
    <div className="space-y-6">
      <PageHeader
        title="Category Management"
        description="Manage your menu categories and items"
        actionButton={{
          label: "Add New Category",
          icon: <Plus className="w-4 h-4 mr-2" />,
          href: "/dashboard/categories/create",
        }}
      />

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Search categories..."
      />
    </div>
  );
}

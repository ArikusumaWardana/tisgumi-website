import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getCustomersWithPricing } from "./lib/data";

export default async function PricingPage() {
  // Get all customers with custom pricing from the database
  const data = await getCustomersWithPricing();

  // Return the pricing page
  return (
    <div className="space-y-6">
      <PageHeader
        title="Custom Product Pricing Management"
        description="Manage customers with custom product pricing"
        actionButton={{
          label: "Add New Custom Product Pricing",
          icon: <Plus className="w-4 h-4 mr-2" />,
          href: "/dashboard/pricing/create",
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

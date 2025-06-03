import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getOrders } from "./lib/data";

export default async function OrdersPage() {
  // Get all orders from the database
  const data = await getOrders();

  // Return the orders page
  return (
    <div className="space-y-6">
      <PageHeader
        title="Order Management"
        description="Manage customer orders and invoices"
        actionButton={{
          label: "Create New Order",
          icon: <Plus className="w-4 h-4 mr-2" />,
          href: "/dashboard/orders/create",
        }}
      />

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Search orders..."
      />
    </div>
  );
}

import { PageHeader } from "@/components/ui/page-header";
import { Plus } from "lucide-react";
import { OrdersTableSkeleton } from "./_components/orders-table-skeleton";

export default function Loading() {
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

      <OrdersTableSkeleton />
    </div>
  );
}

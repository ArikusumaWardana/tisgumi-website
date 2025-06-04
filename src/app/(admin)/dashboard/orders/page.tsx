import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { getOrdersPaginated } from "./lib/data";
import Link from "next/link";
import OrdersClientWrapper from "./_components/orders-client-wrapper";

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

function PaginationNav({
  pagination,
  search,
  startDate,
  endDate,
}: {
  pagination: { page: number; totalPages: number; total: number };
  search: string;
  startDate?: string;
  endDate?: string;
}) {
  const { page, totalPages } = pagination;

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    params.set("page", pageNum.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages} ({pagination.total} total items)
      </p>
      <div className="flex items-center space-x-2">
        {page > 1 && (
          <Link href={createPageUrl(page - 1)}>
            <Button variant="outline" size="sm">
              Previous
            </Button>
          </Link>
        )}
        {page < totalPages && (
          <Link href={createPageUrl(page + 1)}>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  // Await searchParams before accessing properties (Next.js 15 requirement)
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const search = params.search || "";
  const startDate = params.startDate || "";
  const endDate = params.endDate || "";

  // Get paginated data with date filtering
  const { data, pagination } = await getOrdersPaginated({
    page,
    limit,
    search,
    startDate,
    endDate,
  });

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

      <div className="space-y-4">
        {/* Client components wrapper */}
        <OrdersClientWrapper search={search} />

        {/* Data table */}
        <DataTable columns={columns} data={data} />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <PaginationNav
            pagination={pagination}
            search={search}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </div>
    </div>
  );
}

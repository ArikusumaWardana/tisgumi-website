import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/ui/search-form";
import { columns } from "./columns";
import { getCustomersWithPricingPaginated } from "./lib/data";
import Link from "next/link";

interface PricingPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
  }>;
}

function PaginationNav({
  pagination,
  search,
}: {
  pagination: { page: number; totalPages: number; total: number };
  search: string;
}) {
  const { page, totalPages } = pagination;

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
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

export default async function PricingPage({ searchParams }: PricingPageProps) {
  // Await searchParams before accessing properties (Next.js 15 requirement)
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const search = params.search || "";

  // Get paginated data
  const { data, pagination } = await getCustomersWithPricingPaginated({
    page,
    limit,
    search,
  });

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

      <div className="space-y-4">
        {/* Search bar with button and loading */}
        <SearchForm placeholder="Search customers..." defaultValue={search} />

        {/* Data table */}
        <DataTable columns={columns} data={data} />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <PaginationNav pagination={pagination} search={search} />
        )}
      </div>
    </div>
  );
}

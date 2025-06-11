import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/ui/search-form";
import { getCustomersPaginated } from "./lib/data";
import { getUser } from "@/lib/auth";
import { CustomersTable } from "./_components/customers-table";
import { CustomerSuccessAlert } from "./_components/success-alert";
import Link from "next/link";
import { Suspense } from "react";

interface CustomersPageProps {
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

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  // Get current user for role checking
  const { user } = await getUser();

  // Await searchParams before accessing properties (Next.js 15 requirement)
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const search = params.search || "";

  // Get paginated data
  const { data, pagination } = await getCustomersPaginated({
    page,
    limit,
    search,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Management"
        description="Manage your customers"
        user={user}
        actionButton={{
          label: "Add New Customer",
          icon: <Plus className="w-4 h-4 mr-2" />,
          href: "/dashboard/customers/create",
          requiresSuperadmin: true,
          module: "customers",
        }}
      />

      {/* Success Alert */}
      <Suspense>
        <CustomerSuccessAlert />
      </Suspense>

      <div className="space-y-4">
        {/* Search bar with button and loading */}
        <SearchForm placeholder="Search customers..." defaultValue={search} />

        {/* Data table */}
        <CustomersTable data={data} user={user} />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <PaginationNav pagination={pagination} search={search} />
        )}
      </div>
    </div>
  );
}

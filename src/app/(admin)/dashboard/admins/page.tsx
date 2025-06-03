import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/ui/search-form";
import { columns } from "./columns";
import { getAdminsPaginated } from "./lib/data";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

interface AdminsPageProps {
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

export default async function AdminsPage({ searchParams }: AdminsPageProps) {
  // Check user role for access control
  const { user } = await getUser();

  // If user is not superadmin, redirect to dashboard
  if (!user || user.role !== "superadmin") {
    return redirect("/dashboard");
  }

  // Await searchParams before accessing properties (Next.js 15 requirement)
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const search = params.search || "";

  // Get paginated data
  const { data, pagination } = await getAdminsPaginated({
    page,
    limit,
    search,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Management"
        description="Manage your system admins"
        actionButton={{
          label: "Add New Admin",
          icon: <Plus className="w-4 h-4 mr-2" />,
          href: "/dashboard/admins/create",
        }}
      />

      <div className="space-y-4">
        {/* Search bar with button and loading */}
        <SearchForm placeholder="Search admins..." defaultValue={search} />

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

import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getAdmins } from "./lib/data";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminsPage() {
  // Check user role for access control
  const { user } = await getUser();

  // If user is not superadmin, redirect to dashboard
  if (!user || user.role !== "superadmin") {
    return redirect("/dashboard");
  }

  // Get all admins from the database
  const data = await getAdmins();

  // Return the admins page
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

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Search admins..."
      />
    </div>
  );
}

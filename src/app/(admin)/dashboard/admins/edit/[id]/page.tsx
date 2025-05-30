import React from "react";
import { getAdminById } from "../../lib/data";
import { redirect } from "next/navigation";
import FormAdmin from "../../_components/form-admin";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUser } from "@/lib/auth";

// Type for the params
type Tparams = {
  id: string;
};

interface EditAdminPageProps {
  params: Promise<Tparams>;
}

// Edit admin page
export default async function EditAdminPage({ params }: EditAdminPageProps) {
  // Check user role for access control
  const { user } = await getUser();

  // If user is not superadmin, redirect to dashboard
  if (!user || user.role !== "superadmin") {
    return redirect("/dashboard");
  }

  // Await params before using its properties
  const resolvedParams = await params;
  const data = await getAdminById(resolvedParams.id);

  // If the admin is not found, redirect to the admins page
  if (!data) {
    return redirect("/dashboard/admins");
  }

  // Return the edit admin page
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admins">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Update Admin
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Update the admin to manage your system
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <FormAdmin type="update" data={data} />
      </div>
    </div>
  );
}

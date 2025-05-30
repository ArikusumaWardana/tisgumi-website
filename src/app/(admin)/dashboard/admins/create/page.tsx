import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FormAdmin from "@/app/(admin)/dashboard/admins/_components/form-admin";

export default function CreateAdminPage() {
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
            Create New Admin
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add a new admin to manage your system
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <FormAdmin />
      </div>
    </div>
  );
}

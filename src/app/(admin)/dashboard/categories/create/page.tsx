import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FormCategory from "@/app/(admin)/dashboard/categories/_components/form-category";

export default function CreateCategoryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/categories">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Category
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add a new category to organize your menu items
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <FormCategory />
      </div>
    </div>
  );
}

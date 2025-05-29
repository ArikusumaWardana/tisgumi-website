import React from "react";
import { getCategoryById } from "../../lib/data";
import { redirect } from "next/navigation";
import FormCategory from "../../_components/form-category";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Type for the params
type Tparams = {
  id: string;
};

interface EditCategoryPageProps {
  params: Tparams;
}

// Edit category page
export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const data = await getCategoryById(params.id);

  // If the category is not found, redirect to the categories page
  if (!data) {
    return redirect("/dashboard/categories");
  }

  // Return the edit category page
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
            Update Category
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Update the category to organize your menu items
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <FormCategory type="update" data={data} />
      </div>
    </div>
  );
}

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FormProduct from "@/app/(admin)/dashboard/products/_components/form-product";
import { getCategories } from "../../categories/lib/data";

export default async function CreateProductPage() {
  // Fetch categories server-side
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Product
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add a new product to organize your menu items
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <FormProduct categories={categories} />
      </div>
    </div>
  );
}

import React from "react";
import { getProductById } from "../../lib/data";
import { redirect } from "next/navigation";
import FormProduct from "../../_components/form-product";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCategories } from "../../../categories/lib/data";

// Type for the params
type Tparams = {
  id: string;
};

// Type for the props
type EditProductPageProps = {
  params: Promise<Tparams>;
};

// Edit product page
export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  // Await params before using its properties
  const resolvedParams = await params;

  // Fetch product data and categories in parallel
  const [data, categories] = await Promise.all([
    getProductById(resolvedParams.id),
    getCategories(),
  ]);

  // If the product is not found, redirect to the products page
  if (!data) {
    return redirect("/dashboard/products");
  }

  // Return the edit product page
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
            Update Product
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Update the product to organize your menu items
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <FormProduct type="update" data={data} categories={categories} />
      </div>
    </div>
  );
}

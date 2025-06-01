import React from "react";
import { getCustomProductPricingById } from "../../lib/data";
import { redirect } from "next/navigation";
import FormCustomProductPricing from "../../_components/form-pricing";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Type for the params
type Tparams = {
  id: string;
};

interface EditCustomProductPricingPageProps {
  params: Promise<Tparams>;
}

// Edit custom product pricing page
export default async function EditCustomProductPricingPage({
  params,
}: EditCustomProductPricingPageProps) {
  // Await params before using its properties
  const resolvedParams = await params;
  const data = await getCustomProductPricingById(resolvedParams.id);

  // If the custom product pricing is not found, redirect to the custom product pricings page
  if (!data) {
    return redirect("/dashboard/pricing");
  }

  // Return the edit custom product pricing page
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/pricing">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Update Custom Product Pricing
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Update the custom product pricing to organize your menu items
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <FormCustomProductPricing type="update" data={data} />
      </div>
    </div>
  );
}

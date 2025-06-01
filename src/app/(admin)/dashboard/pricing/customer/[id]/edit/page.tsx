import React from "react";
import { getCustomerPricingDetails } from "../../../lib/data";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FormCustomerPricing from "../../../_components/form-customer-pricing";

// Type for the params
type Tparams = {
  id: string;
};

interface EditCustomerPricingPageProps {
  params: Promise<Tparams>;
}

// Edit customer pricing page
export default async function EditCustomerPricingPage({
  params,
}: EditCustomerPricingPageProps) {
  // Await params before using its properties
  const resolvedParams = await params;
  const customer = await getCustomerPricingDetails(resolvedParams.id);

  // If the customer is not found, redirect to the pricing page
  if (!customer) {
    return redirect("/dashboard/pricing");
  }

  // Return the edit customer pricing page
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/pricing/customer/${customer.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Details
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Custom Pricing for {customer.name}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Update custom pricing for this customer
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <FormCustomerPricing type="update" customerData={customer} />
      </div>
    </div>
  );
}

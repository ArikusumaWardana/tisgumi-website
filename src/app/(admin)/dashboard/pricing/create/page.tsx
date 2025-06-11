import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FormCustomerPricing from "../_components/form-customer-pricing";

export default function CreatePricingPage() {
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
            Create New Custom Product Pricing
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add custom pricing for a customer&apos;s products
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <FormCustomerPricing type="create" />
      </div>
    </div>
  );
}

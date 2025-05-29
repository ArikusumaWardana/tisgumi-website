import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FormCustomer from "../_components/form-customer";

export default function CreateCategoryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/customers">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Customer
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add a new customer to organize your menu items
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <FormCustomer />
      </div>
    </div>
  );
}

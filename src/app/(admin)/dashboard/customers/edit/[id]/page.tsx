import React from "react";
import { getCustomerById } from "../../lib/data";
import { redirect } from "next/navigation";
import FormCustomer from "../../_components/form-customer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Type for the params
type Tparams = {
  id: string;
};

interface EditCustomerPageProps {
  params: Promise<Tparams>;
}

// Edit customer page
export default async function EditCustomerPage({
  params,
}: EditCustomerPageProps) {
  // Await params before using its properties
  const resolvedParams = await params;
  const data = await getCustomerById(resolvedParams.id);

  // If the customer is not found, redirect to the customers page
  if (!data) {
    return redirect("/dashboard/customers");
  }

  // Return the edit customer page
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
            Update Customer
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Update the customer to organize your menu items
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <FormCustomer type="update" data={data} />
      </div>
    </div>
  );
}

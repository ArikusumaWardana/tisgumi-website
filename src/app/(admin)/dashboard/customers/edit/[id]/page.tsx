import React from "react";
import { getCustomerById } from "../../lib/data";
import { redirect, notFound } from "next/navigation";
import FormCustomer from "../../_components/form-customer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUser } from "@/lib/auth";

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
  // Check user role for access control
  const { user } = await getUser();

  // If user is not superadmin, redirect to customers page
  if (!user || user.role !== "superadmin") {
    return redirect("/dashboard/customers");
  }

  // Await params before using its properties
  const resolvedParams = await params;
  const data = await getCustomerById(resolvedParams.id);

  // If the customer is not found, show 404 page
  if (!data) {
    notFound();
  }

  // Return the edit customer page
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/customers">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Customers
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Update Customer
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Update customer information
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

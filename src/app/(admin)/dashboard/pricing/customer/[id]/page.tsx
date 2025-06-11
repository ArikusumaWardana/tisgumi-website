import React from "react";
import { getCustomerPricingDetails } from "../../lib/data";
import { notFound } from "next/navigation";
import { ArrowLeft, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatIndonesianDate } from "@/utils/date-utils";

// Type for the params
type Tparams = {
  id: string;
};

interface CustomerPricingDetailsPageProps {
  params: Promise<Tparams>;
}

// Customer pricing details page
export default async function CustomerPricingDetailsPage({
  params,
}: CustomerPricingDetailsPageProps) {
  // Await params before using its properties
  const resolvedParams = await params;
  const customer = await getCustomerPricingDetails(resolvedParams.id);

  // If the customer is not found, show 404 page
  if (!customer) {
    notFound();
  }

  // Return the customer pricing details page
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/pricing">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer Pricing Details
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View all custom pricing for this customer
          </p>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Customer Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Customer Code
            </label>
            <p className="text-sm text-gray-900 dark:text-white mt-1">
              {customer.code}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Customer Name
            </label>
            <p className="text-sm text-gray-900 dark:text-white mt-1">
              {customer.name}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <p className="text-sm text-gray-900 dark:text-white mt-1">
              {customer.phone}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="mt-1">
              <StatusBadge status={customer.status} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Total Custom Products
            </label>
            <p className="text-sm text-gray-900 dark:text-white mt-1">
              {customer.custom_prices.length} Product
              {customer.custom_prices.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Customer Since
            </label>
            <p className="text-sm text-gray-900 dark:text-white mt-1">
              {formatIndonesianDate(customer.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Custom Pricing Products */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Custom Pricing Products
            </h2>
          </div>
          {customer.custom_prices.length > 0 && (
            <Link href={`/dashboard/pricing/customer/${customer.id}/edit`}>
              <Button variant="outline" size="sm">
                Edit Pricing
              </Button>
            </Link>
          )}
        </div>

        {customer.custom_prices.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No custom pricing products found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {customer.custom_prices.map((pricing, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Number
                    </label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {`CP-${index + 1}`}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Product
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      {pricing.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {pricing.product.code} • {pricing.product.category.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Default Price
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      Rp {pricing.product.default_price.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Custom Price
                    </label>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                      Rp {pricing.custom_price.toLocaleString()}
                    </p>
                    {pricing.custom_price !== pricing.product.default_price && (
                      <p className="text-xs text-gray-500">
                        {pricing.custom_price > pricing.product.default_price
                          ? `+Rp ${(
                              pricing.custom_price -
                              pricing.product.default_price
                            ).toLocaleString()}`
                          : `-Rp ${(
                              pricing.product.default_price -
                              pricing.custom_price
                            ).toLocaleString()}`}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                  Created: {formatIndonesianDate(pricing.created_at)}
                  {pricing.updated_at > pricing.created_at && (
                    <span className="ml-4">
                      Updated: {formatIndonesianDate(pricing.updated_at)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

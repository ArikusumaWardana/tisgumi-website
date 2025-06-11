import React from "react";
import { getOrderById } from "../lib/data";
import { redirect } from "next/navigation";
import { ArrowLeft, Package, User, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatIndonesianDate } from "@/utils/date-utils";
import { InvoiceActions } from "../_components/invoice-actions";
import { PaymentStatusEditor } from "../_components/payment-status-editor";
import { SuccessAlert } from "./_components/success-alert";
import { Suspense } from "react";

// Type for the params
type Tparams = {
  id: string;
};

interface OrderDetailsPageProps {
  params: Promise<Tparams>;
}

// Order details page
export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  // Await params before using its properties
  const resolvedParams = await params;
  const order = await getOrderById(resolvedParams.id);

  // If the order is not found, redirect to the orders page
  if (!order) {
    return redirect("/dashboard/orders");
  }

  // Return the order details page
  return (
    <div className="space-y-6">
      {/* Success Alert */}
      <Suspense fallback={null}>
        <SuccessAlert />
      </Suspense>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order Details
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View order information and generate invoices
          </p>
        </div>
        <InvoiceActions orderId={order.id} />
      </div>

      {/* Order Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Order Information
            </h2>
          </div>
          <PaymentStatusEditor
            orderId={order.id}
            currentStatus={order.status}
            paymentDate={order.payment_date}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Order Code
            </label>
            <p className="text-sm text-gray-900 dark:text-white mt-1">
              {order.code}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="mt-1">
              <StatusBadge
                status={order.status === "lunas" ? "Lunas" : "Belum Lunas"}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Payment Date
            </label>
            <p className="text-sm text-gray-900 dark:text-white mt-1">
              {order.payment_date
                ? formatIndonesianDate(order.payment_date)
                : "Not set"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Created By
            </label>
            <p className="text-sm text-gray-900 dark:text-white mt-1">
              {order.created_by_user.name} ({order.created_by_user.code})
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Total Items
            </label>
            <p className="text-sm text-gray-900 dark:text-white mt-1">
              {order.total_items} item{order.total_items !== 1 ? "s" : ""}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Total Amount
            </label>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
              Rp {order.total_amount.toLocaleString()}
            </p>
          </div>
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
              {order.customer.code}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Customer Name
            </label>
            <p className="text-sm text-gray-900 dark:text-white mt-1">
              {order.customer.name}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <p className="text-sm text-gray-900 dark:text-white mt-1">
              +{order.customer.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Order Items
          </h2>
        </div>

        {order.order_items.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No order items found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {order.order_items.map((item, index) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Item #{index + 1}
                    </label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {item.code}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Product
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.product.code} • {item.product.category.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Quantity
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      {item.quantity}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Price at Time
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      Rp {item.price_at_time.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Subtotal
                    </label>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                      Rp {(item.price_at_time * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                  Added: {formatIndonesianDate(item.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoices */}
      {order.invoices.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Generated Invoices
            </h2>
          </div>

          <div className="space-y-2">
            {order.invoices.map((invoice, index) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Invoice #{index + 1} (
                    {invoice.show_price ? "With Prices" : "Without Prices"})
                  </p>
                  <p className="text-xs text-gray-500">
                    Generated: {formatIndonesianDate(invoice.created_at)}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={invoice.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Order Timeline
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Order Created
              </p>
              <p className="text-xs text-gray-500">
                {formatIndonesianDate(order.created_at)}
              </p>
            </div>
          </div>
          {order.updated_at > order.created_at && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Order Updated
                </p>
                <p className="text-xs text-gray-500">
                  {formatIndonesianDate(order.updated_at)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

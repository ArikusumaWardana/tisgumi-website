import React from "react";
import { getOrderById } from "../lib/data";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Package,
  User,
  FileText,
  Download,
  Calendar,
  Hash,
  CreditCard,
} from "lucide-react";
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

  // If the order is not found, show 404 page
  if (!order) {
    notFound();
  }

  // Return the order details page
  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Success Alert */}
      <Suspense fallback={null}>
        <SuccessAlert />
      </Suspense>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Link href="/dashboard/orders" className="w-fit">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Order Details
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            View order information and generate invoices
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <InvoiceActions orderId={order.id} />
        </div>
      </div>

      {/* Order Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Order Information
            </h2>
          </div>
          <div className="w-full sm:w-auto">
            <PaymentStatusEditor
              orderId={order.id}
              currentStatus={order.status}
              paymentDate={order.payment_date}
            />
          </div>
        </div>

        {/* Mobile-first responsive grid */}
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 lg:gap-6">
          {/* Order Code */}
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Hash className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-500">
                Order Code
              </label>
            </div>
            <p className="text-base font-mono text-gray-900 dark:text-white">
              {order.code}
            </p>
          </div>

          {/* Status */}
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
            </div>
            <StatusBadge
              status={order.status === "lunas" ? "Lunas" : "Belum Lunas"}
            />
          </div>

          {/* Payment Date */}
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-500">
                Payment Date
              </label>
            </div>
            <p className="text-base text-gray-900 dark:text-white">
              {order.payment_date
                ? formatIndonesianDate(order.payment_date)
                : "Not set"}
            </p>
          </div>

          {/* Created By */}
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <label className="text-sm font-medium text-gray-500 block mb-1">
              Created By
            </label>
            <p className="text-base text-gray-900 dark:text-white">
              {order.created_by_user.name}
            </p>
            <p className="text-sm text-gray-500 font-mono">
              {order.created_by_user.code}
            </p>
          </div>

          {/* Total Items */}
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <label className="text-sm font-medium text-gray-500 block mb-1">
              Total Items
            </label>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {order.total_items}
              <span className="text-sm font-normal text-gray-500 ml-1">
                item{order.total_items !== 1 ? "s" : ""}
              </span>
            </p>
          </div>

          {/* Total Amount */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <label className="text-sm font-medium text-blue-700 dark:text-blue-300 block mb-1">
              Total Amount
            </label>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              Rp {order.total_amount.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <User className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Customer Information
          </h2>
        </div>

        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 lg:gap-6">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <label className="text-sm font-medium text-gray-500 block mb-1">
              Customer Code
            </label>
            <p className="text-base font-mono text-gray-900 dark:text-white">
              {order.customer.code}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <label className="text-sm font-medium text-gray-500 block mb-1">
              Customer Name
            </label>
            <p className="text-base text-gray-900 dark:text-white">
              {order.customer.name}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:col-span-2 lg:col-span-1">
            <label className="text-sm font-medium text-gray-500 block mb-1">
              Phone Number
            </label>
            <p className="text-base font-mono text-gray-900 dark:text-white">
              {order.customer.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Package className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Order Items ({order.order_items.length})
          </h2>
        </div>

        {order.order_items.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-full w-fit mx-auto mb-4">
              <Package className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <p className="text-gray-500">No order items found</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {order.order_items.map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-200 bg-gray-50/50 dark:bg-gray-700/20"
              >
                {/* Mobile-first layout */}
                <div className="space-y-3 sm:space-y-0">
                  {/* Item header */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                          Item #{index + 1}
                        </span>
                        <span className="text-xs font-mono text-gray-500 truncate">
                          {item.code}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <span className="font-mono">{item.product.code}</span>
                        <span>•</span>
                        <span>{item.product.category.name}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        Rp{" "}
                        {(item.price_at_time * item.quantity).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                      <p className="text-xs text-gray-500">Subtotal</p>
                    </div>
                  </div>

                  {/* Item details grid for larger screens */}
                  <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div>
                      <label className="text-xs font-medium text-gray-500 block mb-1">
                        Quantity
                      </label>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.quantity} pcs
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 block mb-1">
                        Price at Time
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        Rp {item.price_at_time.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="text-xs font-medium text-gray-500 block mb-1">
                        Added
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatIndonesianDate(item.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Mobile-specific layout */}
                  <div className="sm:hidden flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Qty</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.quantity}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          Rp {item.price_at_time.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Added</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatIndonesianDate(item.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoices */}
      {order.invoices.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Generated Invoices ({order.invoices.length})
            </h2>
          </div>

          <div className="space-y-3">
            {order.invoices.map((invoice, index) => (
              <div
                key={invoice.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-700/20"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Invoice #{index + 1}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full w-fit ${
                        invoice.show_price
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {invoice.show_price ? "With Prices" : "Without Prices"}
                    </span>
                    <p className="text-xs text-gray-500">
                      Generated: {formatIndonesianDate(invoice.created_at)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  asChild
                >
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
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Order Timeline
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full mt-1 shrink-0"></div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Order Created
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {formatIndonesianDate(order.created_at)}
              </p>
            </div>
          </div>
          {order.updated_at > order.created_at && (
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 shrink-0"></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Order Updated
                </p>
                <p className="text-sm text-gray-500 mt-1">
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

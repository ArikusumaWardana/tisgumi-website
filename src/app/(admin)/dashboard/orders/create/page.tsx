import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FormOrder from "../_components/form-order";

export default function CreateOrderPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Order
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create a new order for a customer
          </p>
        </div>
      </div>

      {/* Form */}
      <FormOrder />
    </div>
  );
}

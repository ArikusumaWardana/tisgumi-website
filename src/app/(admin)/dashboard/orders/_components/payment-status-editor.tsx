"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit3 } from "lucide-react";
import { updatePaymentStatus } from "../lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface PaymentStatusEditorProps {
  orderId: number;
  currentStatus: "lunas" | "belum_lunas";
  paymentDate?: Date | null;
}

export function PaymentStatusEditor({
  orderId,
  currentStatus,
  paymentDate,
}: PaymentStatusEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"lunas" | "belum_lunas">(
    currentStatus
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleUpdateStatus = async () => {
    if (selectedStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await updatePaymentStatus(orderId, selectedStatus);

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Payment status updated successfully",
        });
        setIsOpen(false);
        router.refresh(); // Refresh the page to show updated data
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusLabel = (status: "lunas" | "belum_lunas") => {
    return status === "lunas" ? "Lunas (Paid)" : "Belum Lunas (Unpaid)";
  };

  const getStatusColor = (status: "lunas" | "belum_lunas") => {
    return status === "lunas" ? "text-green-600" : "text-red-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Payment Status
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Payment Status</DialogTitle>
          <DialogDescription>
            Update the payment status for this order. If you mark it as paid,
            the payment date will be automatically recorded.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Current Status */}
          <div className="space-y-2">
            <Label>Current Status</Label>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <p className={`font-medium ${getStatusColor(currentStatus)}`}>
                {getStatusLabel(currentStatus)}
              </p>
              {currentStatus === "lunas" && paymentDate && (
                <p className="text-sm text-gray-500 mt-1">
                  Paid on: {new Date(paymentDate).toLocaleDateString("id-ID")}
                </p>
              )}
            </div>
          </div>

          {/* New Status */}
          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value: "lunas" | "belum_lunas") =>
                setSelectedStatus(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lunas">Lunas (Paid)</SelectItem>
                <SelectItem value="belum_lunas">
                  Belum Lunas (Unpaid)
                </SelectItem>
              </SelectContent>
            </Select>
            {selectedStatus === "lunas" && currentStatus !== "lunas" && (
              <p className="text-sm text-green-600">
                Payment date will be set to current date and time
              </p>
            )}
            {selectedStatus === "belum_lunas" && currentStatus === "lunas" && (
              <p className="text-sm text-orange-600">
                Payment date will be cleared
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStatus}
            disabled={isLoading || selectedStatus === currentStatus}
          >
            {isLoading ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WhatsAppActionsProps {
  orderId: number;
  customerPhone: string;
  customerName: string;
  orderCode: string;
}

// Warehouse WhatsApp number (you can move this to environment variables later)
const WAREHOUSE_PHONE = "6285339307788"; // Nomor gudang

export function WhatsAppActions({
  orderId,
  customerPhone,
  customerName,
}: WhatsAppActionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateAndSendInvoice = async (showPrice: boolean, phone: string) => {
    setIsGenerating(true);

    try {
      // Generate invoice
      const response = await fetch(`/api/orders/${orderId}/generate-invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          showPrices: showPrice,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate invoice: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.downloadUrl) {
        // Create WhatsApp message
        const recipientType = showPrice ? "Customer" : "Warehouse";
        const timestamp = new Date().toISOString().split("T")[0];
        const invoiceFileName = `invoice-${timestamp}-${
          showPrice ? "customer" : "warehouse"
        }.pdf`;

        const message = encodeURIComponent(
          `Halo *${recipientType}*!\n\n` +
            `Kami dari *Tisgumi* memberitahukan bahwa invoice untuk order atas nama *${customerName}* telah siap.\n\n` +
            `Silakan lihat invoice melalui link berikut:\n${data.downloadUrl}\n` +
            `Nama file: ${invoiceFileName}\n\n` +
            `Terima kasih!`
        );

        // Open WhatsApp
        const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
        window.open(whatsappUrl, "_blank");

        toast({
          title: "Invoice Generated",
          description: `Invoice for ${recipientType} has been generated and WhatsApp opened.`,
        });
      } else {
        throw new Error("Failed to generate invoice");
      }
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast({
        title: "Error",
        description: "Failed to generate invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const sendToWarehouse = () => {
    generateAndSendInvoice(false, WAREHOUSE_PHONE);
  };

  const sendToCustomer = () => {
    // Clean phone number (remove + if exists)
    const cleanPhone = customerPhone.replace(/^\+/, "");
    generateAndSendInvoice(true, cleanPhone);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isGenerating}>
          {isGenerating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <MessageSquare className="w-4 h-4 mr-2" />
          )}
          {isGenerating ? "Sending..." : "WhatsApp"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={sendToWarehouse} disabled={isGenerating}>
          <Package className="w-4 h-4 mr-2" />
          Send to Warehouse (No Price)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={sendToCustomer} disabled={isGenerating}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Send to Customer (With Price)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

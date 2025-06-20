"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvoiceActionsProps {
  orderId: number;
}

export function InvoiceActions({ orderId }: InvoiceActionsProps) {
  const [isGeneratingWithPrices, setIsGeneratingWithPrices] = useState(false);
  const [isGeneratingWithoutPrices, setIsGeneratingWithoutPrices] =
    useState(false);
  const { toast } = useToast();

  const generateInvoice = async (showPrices: boolean) => {
    try {
      if (showPrices) {
        setIsGeneratingWithPrices(true);
      } else {
        setIsGeneratingWithoutPrices(true);
      }

      const response = await fetch(`/api/orders/${orderId}/generate-invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ showPrices }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate invoice");
      }

      const data = await response.json();

      if (data.downloadUrl) {
        // Open download URL in new tab
        window.open(data.downloadUrl, "_blank");

        toast({
          title: "Invoice Generated",
          description: `Invoice ${
            showPrices ? "with prices" : "without prices"
          } has been generated and downloaded.`,
        });

        // Refresh the page to show updated invoices
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast({
        title: "Error",
        description: `Failed to generate invoice ${
          showPrices ? "with prices" : "without prices"
        }`,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingWithPrices(false);
      setIsGeneratingWithoutPrices(false);
    }
  };

  return (
    <div className="flex gap-2 flex-col lg:flex-row">
      <Button
        variant="outline"
        size="sm"
        onClick={() => generateInvoice(true)}
        disabled={isGeneratingWithPrices || isGeneratingWithoutPrices}
      >
        {isGeneratingWithPrices ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )}
        {isGeneratingWithPrices
          ? "Generating..."
          : "Generate Invoice (With Prices)"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => generateInvoice(false)}
        disabled={isGeneratingWithPrices || isGeneratingWithoutPrices}
      >
        {isGeneratingWithoutPrices ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )}
        {isGeneratingWithoutPrices
          ? "Generating..."
          : "Generate Invoice (Without Prices)"}
      </Button>
    </div>
  );
}

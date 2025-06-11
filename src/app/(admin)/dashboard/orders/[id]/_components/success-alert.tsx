"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SuccessAlert() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Check if the 'created' parameter is present
    if (searchParams.get("created") === "true") {
      setShowAlert(true);

      // Remove the parameter from URL after showing the alert
      const newUrl = window.location.pathname;
      router.replace(newUrl, { scroll: false });

      // Auto-dismiss after 5 seconds with progress animation
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);

      // Update progress every 100ms
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 2; // Decrease by 2% every 100ms (100ms * 50 = 5000ms)
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }

    return () => {}; // Always return cleanup function
  }, [searchParams, router]);

  const handleDismiss = () => {
    setShowAlert(false);
    setProgress(100); // Reset progress
  };

  if (!showAlert) {
    return null;
  }

  return (
    <div className="animate-in slide-in-from-top-2 duration-300">
      <Alert variant="success" className="mb-6">
        <CheckCircle className="h-4 w-4" />
        <div className="flex items-center justify-between">
          <AlertDescription className="flex-1">
            <strong>Order created successfully!</strong> The order has been
            saved and invoices are being generated automatically.
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="ml-2 h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20"
            title="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {/* Progress bar for auto-dismiss countdown */}
        <div className="mt-3 w-full bg-green-200 dark:bg-green-800 rounded-full h-1">
          <div
            className="bg-green-500 dark:bg-green-400 h-1 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Alert>
    </div>
  );
}

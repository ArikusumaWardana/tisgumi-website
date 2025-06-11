"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CustomerSuccessAlert() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const created = searchParams.get("created");
    const updated = searchParams.get("updated");
    const deleted = searchParams.get("deleted");

    if (created === "true") {
      setMessage("Customer has been successfully created!");
      setIsVisible(true);
    } else if (updated === "true") {
      setMessage("Customer has been successfully updated!");
      setIsVisible(true);
    } else if (deleted === "true") {
      setMessage("Customer has been successfully deleted!");
      setIsVisible(true);
    }

    // Clean up URL parameters
    if (created || updated || deleted) {
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsVisible(false);
          setCountdown(5);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    setCountdown(5);
  };

  if (!isVisible) return null;

  return (
    <div className="mb-6 animate-in slide-in-from-top-2 duration-300">
      <Alert variant="success" className="relative">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{message}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-75">
              Auto-dismiss in {countdown}s
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-900/30"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </AlertDescription>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-green-200 dark:bg-green-800 w-full rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / 5) * 100}%` }}
          />
        </div>
      </Alert>
    </div>
  );
}

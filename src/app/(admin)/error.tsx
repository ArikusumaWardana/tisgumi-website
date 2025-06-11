"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, AlertTriangle, Shield } from "lucide-react";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    console.error("Admin Dashboard Error:", error);
  }, [error]);

  const getErrorInfo = () => {
    const message = error?.message?.toLowerCase() || "";

    if (message.includes("500") || message.includes("internal")) {
      return {
        code: "500",
        title: "SERVER ERROR",
        description:
          "Terjadi kesalahan pada server admin. Tim teknis sedang menangani masalah ini.",
        color: "red",
      };
    } else if (message.includes("503") || message.includes("service")) {
      return {
        code: "503",
        title: "LAYANAN ADMIN TIDAK TERSEDIA",
        description:
          "Dashboard admin sedang dalam maintenance. Silakan coba beberapa saat lagi.",
        color: "orange",
      };
    } else if (message.includes("502") || message.includes("gateway")) {
      return {
        code: "502",
        title: "KONEKSI ERROR",
        description: "Koneksi ke server admin bermasalah. Silakan coba lagi.",
        color: "yellow",
      };
    } else if (message.includes("401") || message.includes("unauthorized")) {
      return {
        code: "401",
        title: "AKSES DITOLAK",
        description: "Sesi admin Anda telah berakhir. Silakan login ulang.",
        color: "purple",
      };
    } else {
      return {
        code: "ERROR",
        title: "KESALAHAN ADMIN",
        description:
          "Dashboard admin mengalami masalah. Silakan muat ulang atau hubungi support.",
        color: "red",
      };
    }
  };

  const errorInfo = getErrorInfo();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
          {/* Tisgumi Admin Header */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image
                src="/logo-tisgumi.webp"
                alt="Tisgumi Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-[#8e8e4b] tracking-wide font-poppins">
                TISGUMI ADMIN
              </span>
            </div>
            <div
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                errorInfo.color === "red"
                  ? "bg-red-100 dark:bg-red-900/30"
                  : errorInfo.color === "orange"
                  ? "bg-orange-100 dark:bg-orange-900/30"
                  : errorInfo.color === "yellow"
                  ? "bg-yellow-100 dark:bg-yellow-900/30"
                  : errorInfo.color === "purple"
                  ? "bg-purple-100 dark:bg-purple-900/30"
                  : "bg-red-100 dark:bg-red-900/30"
              }`}
            >
              {errorInfo.color === "purple" ? (
                <Shield
                  className={`w-8 h-8 ${
                    errorInfo.color === "red"
                      ? "text-red-600 dark:text-red-400"
                      : errorInfo.color === "orange"
                      ? "text-orange-600 dark:text-orange-400"
                      : errorInfo.color === "yellow"
                      ? "text-yellow-600 dark:text-yellow-400"
                      : errorInfo.color === "purple"
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                />
              ) : (
                <AlertTriangle
                  className={`w-8 h-8 ${
                    errorInfo.color === "red"
                      ? "text-red-600 dark:text-red-400"
                      : errorInfo.color === "orange"
                      ? "text-orange-600 dark:text-orange-400"
                      : errorInfo.color === "yellow"
                      ? "text-yellow-600 dark:text-yellow-400"
                      : errorInfo.color === "purple"
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                />
              )}
            </div>
          </div>

          {/* Error Code */}
          <div className="mb-6">
            <h1 className="text-5xl font-bold text-[#decb94]/40 mb-3 font-poppins">
              {errorInfo.code}
            </h1>
            <div
              className={`w-24 h-1 mx-auto rounded-full ${
                errorInfo.color === "red"
                  ? "bg-gradient-to-r from-red-500 to-red-600"
                  : errorInfo.color === "orange"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600"
                  : errorInfo.color === "yellow"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                  : errorInfo.color === "purple"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600"
                  : "bg-gradient-to-r from-red-500 to-red-600"
              }`}
            ></div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 font-poppins tracking-wide">
              {errorInfo.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-poppins mb-4">
              {errorInfo.description}
            </p>

            {/* Error Details (for development) */}
            {process.env.NODE_ENV === "development" && (
              <details className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-left">
                <summary className="cursor-pointer text-[#8e8e4b] font-medium mb-2 text-sm">
                  Detail Error (Development)
                </summary>
                <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto whitespace-pre-wrap break-words max-h-32">
                  {error.message}
                  {error.stack && `\n\nStack:\n${error.stack.slice(0, 500)}...`}
                </pre>
              </details>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={reset}
              className="w-full bg-[#8e8e4b] hover:bg-[#8e8e4b]/80 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-poppins uppercase"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Coba Lagi
            </Button>

            <Button
              onClick={() => (window.location.href = "/dashboard")}
              className="w-full border-[#decb94] bg-transparent text-[#8e8e4b] hover:bg-[#decb94]/10 hover:text-[#8e8e4b] py-3 px-6 rounded-lg transition-all duration-200 font-poppins uppercase font-semibold border-2"
            >
              <Home className="w-4 h-4 mr-2" />
              Ke Dashboard
            </Button>

            {/* Special action for auth errors */}
            {errorInfo.code === "401" && (
              <Button
                onClick={() => (window.location.href = "/login")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-all duration-200 font-poppins uppercase font-semibold"
              >
                <Shield className="w-4 h-4 mr-2" />
                Login Ulang
              </Button>
            )}
          </div>

          {/* Admin Menu Links */}
          <div className="mt-8 pt-6 border-t border-[#decb94]/20">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-poppins font-medium">
              Atau akses menu admin:
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <button
                onClick={() => (window.location.href = "/dashboard/products")}
                className="text-[#8e8e4b] hover:text-[#decb94] hover:underline font-poppins font-medium transition-colors"
              >
                Products
              </button>
              <button
                onClick={() => (window.location.href = "/dashboard/orders")}
                className="text-[#8e8e4b] hover:text-[#decb94] hover:underline font-poppins font-medium transition-colors"
              >
                Orders
              </button>
              <button
                onClick={() => (window.location.href = "/dashboard/customers")}
                className="text-[#8e8e4b] hover:text-[#decb94] hover:underline font-poppins font-medium transition-colors"
              >
                Customers
              </button>
              <button
                onClick={() => (window.location.href = "/dashboard/categories")}
                className="text-[#8e8e4b] hover:text-[#decb94] hover:underline font-poppins font-medium transition-colors"
              >
                Categories
              </button>
            </div>

            {error.digest && (
              <p className="text-xs text-gray-400 mt-4 font-mono">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

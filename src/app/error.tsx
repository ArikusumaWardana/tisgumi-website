"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  // Determine error type based on error message or properties
  const getErrorInfo = () => {
    const message = error?.message?.toLowerCase() || "";

    if (message.includes("500") || message.includes("internal")) {
      return {
        code: "500",
        title: "SERVER ERROR",
        description:
          "Terjadi kesalahan pada server. Tim kami sedang memperbaiki masalah ini.",
        color: "red",
      };
    } else if (message.includes("503") || message.includes("service")) {
      return {
        code: "503",
        title: "LAYANAN TIDAK TERSEDIA",
        description:
          "Layanan sedang dalam maintenance. Silakan coba beberapa saat lagi.",
        color: "orange",
      };
    } else if (message.includes("502") || message.includes("gateway")) {
      return {
        code: "502",
        title: "BAD GATEWAY",
        description: "Koneksi ke server mengalami masalah. Silakan coba lagi.",
        color: "yellow",
      };
    } else {
      return {
        code: "ERROR",
        title: "TERJADI KESALAHAN",
        description:
          "Aplikasi mengalami masalah tak terduga. Silakan muat ulang halaman.",
        color: "red",
      };
    }
  };

  const errorInfo = getErrorInfo();

  return (
    <div
      className="min-h-screen bg-[#0A1316] flex items-center justify-center px-4 relative"
      style={{
        backgroundImage: "url(/background.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80 z-0" />

      <div className="max-w-lg w-full text-center relative z-10">
        {/* Tisgumi Logo */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Image
              src="/logo-tisgumi.webp"
              alt="Tisgumi Logo"
              width={48}
              height={48}
              className="w-12 h-12"
            />
            <span className="text-3xl font-bold text-[#decb94] tracking-wide font-poppins">
              TISGUMI
            </span>
          </div>
        </div>

        {/* Error Icon */}
        <div className="mb-6">
          <div
            className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
              errorInfo.color === "red"
                ? "bg-red-500/20"
                : errorInfo.color === "orange"
                ? "bg-orange-500/20"
                : errorInfo.color === "yellow"
                ? "bg-yellow-500/20"
                : "bg-red-500/20"
            }`}
          >
            <AlertTriangle
              className={`w-10 h-10 ${
                errorInfo.color === "red"
                  ? "text-red-400"
                  : errorInfo.color === "orange"
                  ? "text-orange-400"
                  : errorInfo.color === "yellow"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            />
          </div>
        </div>

        {/* Error Code */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-bold text-[#decb94]/30 mb-4 font-poppins">
            {errorInfo.code}
          </h1>
          <div
            className={`w-32 h-1 mx-auto rounded-full ${
              errorInfo.color === "red"
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : errorInfo.color === "orange"
                ? "bg-gradient-to-r from-orange-500 to-orange-600"
                : errorInfo.color === "yellow"
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                : "bg-gradient-to-r from-red-500 to-red-600"
            }`}
          ></div>
        </div>

        {/* Error Message */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-poppins tracking-wide">
            {errorInfo.title}
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed font-poppins mb-4">
            {errorInfo.description}
          </p>

          {/* Error Details (for development) */}
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4 p-4 bg-black/30 rounded-lg text-left">
              <summary className="cursor-pointer text-[#decb94] font-medium mb-2">
                Detail Error (Development Mode)
              </summary>
              <pre className="text-xs text-gray-400 overflow-auto whitespace-pre-wrap break-words">
                {error.message}
                {error.stack && `\n\nStack:\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={reset}
            className="w-full bg-[#8e8e4b] hover:bg-[#8e8e4b]/80 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-poppins uppercase text-lg"
          >
            <RefreshCw className="w-5 h-5 mr-3" />
            Coba Lagi
          </Button>

          <Button
            onClick={() => (window.location.href = "/dashboard")}
            className="w-full border-2 border-[#decb94] bg-transparent text-[#decb94] hover:bg-[#decb94]/10 hover:text-[#decb94] py-4 px-8 rounded-lg transition-all duration-200 font-poppins uppercase font-semibold"
          >
            <Home className="w-5 h-5 mr-3" />
            Ke Dashboard
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-10 pt-6 border-t border-[#decb94]/20">
          <p className="text-sm text-gray-400 font-poppins">
            Jika masalah terus berlanjut, silakan hubungi tim support Tisgumi.
          </p>
          {error.digest && (
            <p className="text-xs text-gray-500 mt-2 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

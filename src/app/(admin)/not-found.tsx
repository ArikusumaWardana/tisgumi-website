"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Shield } from "lucide-react";

export default function AdminNotFound() {
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
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* 404 Number */}
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-[#decb94]/40 mb-3 font-poppins">
              404
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#decb94] to-[#8e8e4b] mx-auto rounded-full"></div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 font-poppins tracking-wide">
              HALAMAN ADMIN TIDAK DITEMUKAN
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-poppins">
              Halaman admin yang Anda cari tidak dapat ditemukan. Pastikan URL
              yang Anda masukkan benar atau halaman tersebut masih tersedia.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/dashboard">
              <Button className="w-full bg-[#8e8e4b] hover:bg-[#8e8e4b]/80 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-poppins uppercase">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Dashboard
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full border-[#decb94] text-[#8e8e4b] hover:bg-[#decb94]/10 hover:text-[#8e8e4b] py-3 px-6 rounded-lg transition-all duration-200 font-poppins uppercase font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Halaman Sebelumnya
            </Button>
          </div>

          {/* Admin Menu Links */}
          <div className="mt-8 pt-6 border-t border-[#decb94]/20">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-poppins font-medium">
              Atau pilih menu admin:
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link
                href="/dashboard/products"
                className="text-[#8e8e4b] hover:text-[#decb94] hover:underline font-poppins font-medium transition-colors"
              >
                Products
              </Link>
              <Link
                href="/dashboard/orders"
                className="text-[#8e8e4b] hover:text-[#decb94] hover:underline font-poppins font-medium transition-colors"
              >
                Orders
              </Link>
              <Link
                href="/dashboard/customers"
                className="text-[#8e8e4b] hover:text-[#decb94] hover:underline font-poppins font-medium transition-colors"
              >
                Customers
              </Link>
              <Link
                href="/dashboard/categories"
                className="text-[#8e8e4b] hover:text-[#decb94] hover:underline font-poppins font-medium transition-colors"
              >
                Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

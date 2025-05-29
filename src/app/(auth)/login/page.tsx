import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import LoginForm from "./_components/form";

export const metadata: Metadata = {
  title: "Login",
};

export default function Login() {
  return (
    <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
        {/* Logo and Title Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Image
              className="h-16 w-16 sm:h-20 sm:w-20"
              src="/logo-tisgumi.webp"
              alt="Tisgumi Logo"
              width={80}
              height={80}
              priority
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              TISGUMI
            </h1>
            <h2 className="mt-2 text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-300">
              Sign in to your account
            </h2>
          </div>
        </div>

        {/* Form Section */}
        <LoginForm />

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Belum memiliki akun?{" "}
            <Link
              href="#"
              className="font-medium text-[#8e8e4b] hover:text-[#8e8e4b]/80 transition-colors"
            >
              Buat akun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

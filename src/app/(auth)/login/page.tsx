import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function Login() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6 lg:p-8">
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
        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="username"
                  required
                  placeholder="Enter your username"
                  className="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#8e8e4b] dark:focus:ring-[#8e8e4b] sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    href="#"
                    className="font-medium text-[#8e8e4b] hover:text-[#8e8e4b]/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#8e8e4b] dark:focus:ring-[#8e8e4b] sm:text-sm transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="remember-me" />
            <label
              htmlFor="remember-me"
              className="text-sm text-gray-500 font-poppins"
            >
              Remember me
            </label>
          </div>

          <div>
            <Button
              className="w-full bg-[#8e8e4b] hover:bg-[#8e8e4b]/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-base sm:text-lg"
              type="submit"
            >
              Sign in
            </Button>
          </div>
        </form>

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

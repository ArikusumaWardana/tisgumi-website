import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          className="mx-auto h-10 w-auto"
          src="/tisgumi-logo.webp"
          alt="Your Company"
          width={80}
          height={80}
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST">
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                type="username"
                name="username"
                id="username"
                autoComplete="username"
                required
                placeholder="Enter your username"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-800 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  href="#"
                  className="font-semibold text-[#0f7243] hover:text-green-800"
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
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-800 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <Button variant="login">Sign in</Button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Belum memiliki akun?
          <Link
            href="#"
            className="font-semibold text-[#0f7243] hover:text-green-800"
          >
            Buat akun
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tags,
  Users,
  CreditCard,
  UserCog,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: Tags,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Pricing",
    href: "/dashboard/pricing",
    icon: CreditCard,
  },
  {
    title: "Admins",
    href: "/dashboard/admins",
    icon: UserCog,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize sidebar state based on screen size
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Check if window is available (client-side)
    if (typeof window !== "undefined") {
      // Set initial state based on screen width
      return window.innerWidth >= 768; // md breakpoint
    }
    return false; // Default to closed on server-side
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  // Update sidebar state when screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-transform duration-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/tisgumi-logo.webp"
              alt="TISGUMI"
              width={40}
              height={40}
            />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              TISGUMI
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-[#0f7243] text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              /* Handle logout */
            }}
            className="flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "md:ml-64" : ""
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex h-full items-center justify-between px-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1" /> {/* Spacer */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="w-8 h-8 rounded-full bg-[#8e8e4b] flex items-center justify-center text-white font-medium">
                    A
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    Admin
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-2">
                      <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                        Signed in as{" "}
                        <span className="font-medium">admin@tisgumi.com</span>
                      </div>
                      <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                      <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

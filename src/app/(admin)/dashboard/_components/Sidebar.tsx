"use client";

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
  X,
  LogOut,
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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    // Close sidebar on mobile view
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-screen transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo-tisgumi.webp"
            alt="TISGUMI"
            width={40}
            height={40}
          />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            TISGUMI
          </span>
        </Link>
        <button
          onClick={onClose}
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
              onClick={handleLinkClick}
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
  );
}

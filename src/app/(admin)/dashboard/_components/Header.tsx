"use client";

import { useState } from "react";
import { Menu, Bell, ChevronDown } from "lucide-react";
import FormLogout from "./form-logout";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex h-full items-center justify-between px-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1" /> {/* Spacer */}
        <div className="flex items-center gap-2">

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="w-8 h-8 rounded-full bg-[#0f7243] flex items-center justify-center text-white font-medium">
                A
              </div>
              <span className="hidden md:block text-sm font-medium">Admin</span>
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
                  <FormLogout />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

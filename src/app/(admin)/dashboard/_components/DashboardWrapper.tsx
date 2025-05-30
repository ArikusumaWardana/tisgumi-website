"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "@/app/(admin)/dashboard/_components/Sidebar";
import Header from "@/app/(admin)/dashboard/_components/Header";
import { User } from "lucia";

interface DashboardWrapperProps {
  children: React.ReactNode;
  user: User;
}

export default function DashboardWrapper({
  children,
  user,
}: DashboardWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle initial mount and screen size
  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "md:ml-64" : ""
        )}
      >
        {/* Header */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} user={user} />

        {/* Page Content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

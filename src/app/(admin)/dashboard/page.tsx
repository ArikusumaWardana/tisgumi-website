"use client";

import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  ChevronRight,
  Package,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Types for API responses
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

interface NewProduct {
  id: number;
  name: string;
  price: number;
  category: string;
}

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [newProducts, setNewProducts] = useState<NewProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, ordersResponse, productsResponse] =
          await Promise.all([
            fetch("/api/dashboard/stats"),
            fetch("/api/dashboard/recent-orders"),
            fetch("/api/dashboard/new-products"),
          ]);

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setRecentOrders(ordersData);
        }

        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setNewProducts(productsData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate percentage changes (mock data for now)
  const statsConfig = [
    {
      title: "Total Revenue",
      value: stats ? formatCurrency(stats.totalRevenue) : "Rp 0",
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: stats ? stats.totalOrders.toString() : "0",
      icon: ShoppingBag,
    },
    {
      title: "Total Customers",
      value: stats ? stats.totalCustomers.toString() : "0",
      icon: Users,
    },
    {
      title: "Average Order Value",
      value: stats ? formatCurrency(stats.averageOrderValue) : "Rp 0",
      icon: TrendingUp,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Loading Dashboard...  
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we fetch your data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, Admin! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 p-6 rounded-md border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-md bg-[#8e8e4b]/10">
                <stat.icon className="w-6 h-6 text-[#0f7243]" />
              </div>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h2>
            <Link
              href="/dashboard/orders"
              className="text-sm font-medium text-[#0f7243] hover:text-[#0f7243]/80 flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div key={order.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                      <ShoppingBag className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {order.id}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.customer}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(order.amount)}
                      </p>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(order.date)}
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "Lunas"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No recent orders found
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-md border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3 flex flex-col">
            <Link href="/dashboard/orders">
              <button className="w-full px-4 py-2 text-sm font-medium text-white bg-[#0f7243] hover:bg-[#0f7243]/90 rounded-lg transition-colors">
                Create New Order
              </button>
            </Link>
            <Link href="/dashboard/products/create  ">
              <button className="w-full px-4 py-2 text-sm font-medium text-[#0f7243] bg-[#0f7243]/10 hover:bg-[#0f7243]/20 rounded-lg transition-colors">
                Add New Product
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-md border border-gray-200 dark:border-gray-700 lg:col-span-2">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            New Products
          </h3>
          <div className="space-y-4">
            {newProducts.length > 0 ? (
              newProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      <Package className="text-[#0f7243]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[#0f7243]">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No new products found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

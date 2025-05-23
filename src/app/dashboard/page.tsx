 "use client";

 import {
   TrendingUp,
   Users,
   ShoppingBag,
   DollarSign,
   ArrowUpRight,
   ArrowDownRight,
   Clock,
   ChevronRight,
 } from "lucide-react";
import Link from "next/link";

 // Mock data - nanti bisa diganti dengan data real dari API
 const stats = [
   {
     title: "Total Revenue",
     value: "Rp 12.5M",
     change: "+12.5%",
     trend: "up",
     icon: DollarSign,
   },
   {
     title: "Total Orders",
     value: "1,234",
     change: "+8.2%",
     trend: "up",
     icon: ShoppingBag,
   },
   {
     title: "Total Customers",
     value: "856",
     change: "+5.3%",
     trend: "up",
     icon: Users,
   },
   {
     title: "Average Order Value",
     value: "Rp 98.5K",
     change: "-2.4%",
     trend: "down",
     icon: TrendingUp,
   },
 ];

 const recentOrders = [
   {
     id: "ORD-001",
     customer: "John Doe",
     amount: "Rp 150.000",
     status: "completed",
     time: "2 minutes ago",
   },
   {
     id: "ORD-002",
     customer: "Jane Smith",
     amount: "Rp 85.000",
     status: "processing",
     time: "15 minutes ago",
   },
   {
     id: "ORD-003",
     customer: "Mike Johnson",
     amount: "Rp 200.000",
     status: "completed",
     time: "1 hour ago",
   },
   {
     id: "ORD-004",
     customer: "Sarah Wilson",
     amount: "Rp 120.000",
     status: "pending",
     time: "2 hours ago",
   },
 ];

 export default function DashboardPage() {
   return (
     <div className="space-y-6">
       {/* Welcome Section */}
       <div className="flex flex-col gap-1">
         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
           Welcome back, Admin! 👋
         </h1>
         <p className="text-gray-600 dark:text-gray-400">
           Here's what's happening with your store today.
         </p>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((stat) => (
           <div
             key={stat.title}
             className="bg-white dark:bg-gray-800 p-6 rounded-md border border-gray-200 dark:border-gray-700"
           >
             <div className="flex items-center justify-between">
               <div className="p-2 rounded-md bg-[#8e8e4b]/10">
                 <stat.icon className="w-6 h-6 text-[#0f7243]" />
               </div>
               <span
                 className={`flex items-center gap-1 text-sm font-medium ${
                   stat.trend === "up" ? "text-green-600" : "text-red-600"
                 }`}
               >
                 {stat.trend === "up" ? (
                   <ArrowUpRight className="w-4 h-4" />
                 ) : (
                   <ArrowDownRight className="w-4 h-4" />
                 )}
                 {stat.change}
               </span>
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
           {recentOrders.map((order) => (
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
                       {order.amount}
                     </p>
                     <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                       <Clock className="w-4 h-4" />
                       {order.time}
                     </div>
                   </div>
                   <span
                     className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                       order.status === "completed"
                         ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                         : order.status === "processing"
                         ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                         : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                     }`}
                   >
                     {order.status.charAt(0).toUpperCase() +
                       order.status.slice(1)}
                   </span>
                 </div>
               </div>
             </div>
           ))}
         </div>
       </div>

       {/* Quick Actions */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-gray-800 p-6 rounded-md border border-gray-200 dark:border-gray-700">
           <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
             Quick Actions
           </h3>
           <div className="space-y-3">
             <button className="w-full px-4 py-2 text-sm font-medium text-white bg-[#0f7243] hover:bg-[#0f7243]/90 rounded-lg transition-colors">
               Create New Order
             </button>
             <button className="w-full px-4 py-2 text-sm font-medium text-[#0f7243] bg-[#0f7243]/10 hover:bg-[#0f7243]/20 rounded-lg transition-colors">
               Add New Product
             </button>
             <button className="w-full px-4 py-2 text-sm font-medium text-[#0f7243] bg-[#0f7243]/10 hover:bg-[#0f7243]/20 rounded-lg transition-colors">
               View Reports
             </button>
           </div>
         </div>

         <div className="bg-white dark:bg-gray-800 p-6 rounded-md border border-gray-200 dark:border-gray-700 lg:col-span-2">
           <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
             Popular Products
           </h3>
           <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-md bg-gray-200 dark:bg-gray-600"></div>
                 <div>
                   <h4 className="font-medium text-gray-900 dark:text-white">
                     Grilled Chicken Rice
                   </h4>
                   <p className="text-sm text-gray-600 dark:text-gray-400">
                     156 orders this week
                   </p>
                 </div>
               </div>
               <span className="text-sm font-medium text-[#0f7243]">
                 Rp 32.000
               </span>
             </div>
             <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-md bg-gray-200 dark:bg-gray-600"></div>
                 <div>
                   <h4 className="font-medium text-gray-900 dark:text-white">
                     Special Coffee
                   </h4>
                   <p className="text-sm text-gray-600 dark:text-gray-400">
                     98 orders this week
                   </p>
                 </div>
               </div>
               <span className="text-sm font-medium text-[#0f7243]">
                 Rp 18.000
               </span>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 }
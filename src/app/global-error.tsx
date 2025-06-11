 "use client";

 import { useEffect } from "react";
 import Image from "next/image";
 import { Button } from "@/components/ui/button";
 import { RotateCcw, AlertCircle } from "lucide-react";

 interface GlobalErrorProps {
   error: Error & { digest?: string };
   reset: () => void;
 }

 export default function GlobalError({ error, reset }: GlobalErrorProps) {
   useEffect(() => {
     console.error("Critical Global Error:", error);
   }, [error]);

   return (
     <html lang="en">
       <body>
         <div
           className="min-h-screen bg-[#0A1316] flex items-center justify-center px-4 relative"
           style={{
             backgroundImage: "url(/background.webp)",
             backgroundSize: "cover",
             backgroundPosition: "center",
           }}
         >
           {/* Dark overlay */}
           <div className="absolute inset-0 bg-black/90 z-0" />

           <div className="max-w-lg w-full text-center relative z-10">
             {/* Tisgumi Logo */}
             <div className="mb-8">
               <div className="flex items-center justify-center gap-3 mb-6">
                 <Image
                   src="/logo-tisgumi.webp"
                   alt="Tisgumi Logo"
                   width={48}
                   height={48}
                   className="w-12 h-12"
                 />
                 <span className="text-3xl font-bold text-[#decb94] tracking-wide font-poppins">
                   TISGUMI
                 </span>
               </div>
             </div>

             {/* Critical Error Icon */}
             <div className="mb-6">
               <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                 <AlertCircle className="w-12 h-12 text-red-400" />
               </div>
             </div>

             {/* Error Message */}
             <div className="mb-8">
               <h1 className="text-5xl md:text-6xl font-bold text-red-400/50 mb-4 font-poppins">
                 CRITICAL
               </h1>
               <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-red-700 mx-auto rounded-full mb-6"></div>

               <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-poppins tracking-wide">
                 KESALAHAN SISTEM KRITIS
               </h2>
               <p className="text-gray-300 text-lg leading-relaxed font-poppins mb-4">
                 Aplikasi mengalami kesalahan sistem yang kritis.
                 <br className="hidden md:block" />
                 Silakan muat ulang halaman atau hubungi administrator.
               </p>

               {/* Error Details (for development) */}
               {process.env.NODE_ENV === "development" && (
                 <details className="mt-6 p-4 bg-black/40 rounded-lg text-left border border-red-500/30">
                   <summary className="cursor-pointer text-red-400 font-medium mb-3 text-sm">
                     🔧 Critical Error Details (Development Mode)
                   </summary>
                   <div className="space-y-2">
                     <div>
                       <span className="text-red-300 text-xs font-medium">
                         Error Message:
                       </span>
                       <pre className="text-xs text-gray-300 mt-1 p-2 bg-black/30 rounded whitespace-pre-wrap break-words">
                         {error.message || "Unknown error"}
                       </pre>
                     </div>
                     {error.stack && (
                       <div>
                         <span className="text-red-300 text-xs font-medium">
                           Stack Trace:
                         </span>
                         <pre className="text-xs text-gray-400 mt-1 p-2 bg-black/30 rounded whitespace-pre-wrap break-words max-h-40 overflow-auto">
                           {error.stack.slice(0, 1000)}...
                         </pre>
                       </div>
                     )}
                   </div>
                 </details>
               )}
             </div>

             {/* Action Buttons */}
             <div className="space-y-4">
               <Button
                 onClick={reset}
                 className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-poppins uppercase text-lg"
               >
                 <RotateCcw className="w-5 h-5 mr-3" />
                 Muat Ulang Aplikasi
               </Button>

               <Button
                 onClick={() => (window.location.href = "/")}
                 className="w-full border-2 border-[#decb94] bg-transparent text-[#decb94] hover:bg-[#decb94]/10 hover:text-[#decb94] py-4 px-8 rounded-lg transition-all duration-200 font-poppins uppercase font-semibold"
               >
                 Kembali ke Beranda
               </Button>

               {/* Emergency Contact */}
               <div className="mt-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                 <p className="text-sm text-red-300 font-poppins mb-2 font-medium">
                   🚨 Kesalahan Kritis Terdeteksi
                 </p>
                 <p className="text-xs text-gray-400 font-poppins">
                   Jika masalah ini terus terjadi, silakan laporkan ke tim
                   teknis Tisgumi dengan menyertakan informasi berikut:
                 </p>
                 {error.digest && (
                   <p className="text-xs text-gray-300 mt-2 font-mono bg-black/30 p-2 rounded">
                     Error ID: {error.digest}
                   </p>
                 )}
                 <p className="text-xs text-gray-300 mt-1 font-mono bg-black/30 p-2 rounded">
                   Timestamp: {new Date().toISOString()}
                 </p>
               </div>
             </div>
           </div>
         </div>
       </body>
     </html>
   );
 }
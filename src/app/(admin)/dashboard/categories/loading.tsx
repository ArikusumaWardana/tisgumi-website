import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      {/* Main Loading Spinner */}
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0f7243] rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-[#8e8e4b] rounded-full animate-spin animation-delay-150"></div>
      </div>

      {/* Loading Text */}
      <div className="flex flex-col items-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Loading Categories
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please wait while we fetch the data...
        </p>
      </div>

      {/* Animated Dots */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-[#0f7243] rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-[#0f7243] rounded-full animate-bounce animation-delay-100"></div>
        <div className="w-2 h-2 bg-[#0f7243] rounded-full animate-bounce animation-delay-200"></div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import SubtitleWithLine from "./ui/subtitleWithLine";
import { useRouter } from "next/navigation";

export default function WorkingHoursSection() {
  const router = useRouter();
  return (
    <section className="relative w-full flex justify-center items-center min-h-[350px] md:min-h-[480px] py-12 px-4 overflow-hidden">
      {/* Background image */}
      <Image
        src="/background.webp"
        alt="Working Hours Background"
        fill
        className="object-cover object-center z-0"
        style={{ filter: "brightness(0.7)" }}
        priority
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      {/* Content */}
      <div className="relative z-20 flex flex-col md:flex-row w-full max-w-6xl items-center justify-between gap-8">
        {/* Left: Text & Button */}
        <div className="flex-1 flex flex-col justify-center items-start text-white max-w-md md:pl-8">
          <SubtitleWithLine className="text-md">schedule</SubtitleWithLine>
          <h2 className="text-3xl md:text-5xl font-bold font-poppins mb-4 md:mb-8 tracking-wide">
            Working Hours
          </h2>
          <div className="flex gap-4 mb-2">
            <Button
              className="bg-[#8e8e4b] hover:bg-[#8e8e4b]/80 text-white font-semibold px-4 py-5   rounded-sm font-poppins uppercase"
              onClick={() => router.push("#menu")}
            >
              See Our Menu
            </Button>
            <button
              className="text-white font-poppins hover:text-[#8e8e4b] transition uppercase"
              onClick={() => router.push("https://wa.me/+6285339307788")}
            >
              Contact Us
            </button>
          </div>
        </div>
        {/* Right: Card */}
        <div className="flex-1 flex justify-center md:justify-end w-full">
          <div className="bg-[#151c1d] shadow-lg px-8 py-12 min-w-[270px] max-w-xs w-full text-white font-poppins text-center space-y-16 min-h-[320px] md:min-h-[320px] flex flex-col justify-center">
            <div>
              <span className="block text-lg font-semibold mb-1">
                Sunday to Tuesday
              </span>
              <span className="block text-sm">09:00 AM – 10.00 PM</span>
            </div>
            <div>
              <span className="block text-lg font-semibold mb-1">
                Friday to Saturday
              </span>
              <span className="block text-sm">09:00 AM – 10.00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import Link from "next/link";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "About Us", href: "#about" },
  { name: "Features", href: "#features" },
  { name: "Menu", href: "#menu" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full flex items-center justify-between px-8 py-6 font-poppins fixed top-0 left-0 z-30 transition-all duration-300 ${
        scrolled ? "bg-[#10191b]/90 shadow-lg backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="flex items-center gap-2">
        <Image
          src="/tisgumi-logo.webp"
          alt="Foodi Logo"
          width={40}
          height={40}
        />
        <span className="text-2xl font-bold text-[#decb94] tracking-wide font-poppins">
          TISGUMI
        </span>
      </div>
      <ul className="hidden md:flex gap-8 items-center">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-white text-lg font-md transition-colors border-b-2 border-transparent hover:border-[#decb94] px-2 py-1 font-poppins"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-4">
        <Button
          className="bg-[#8e8e4b] hover:bg-[#8e8e4b]/80 text-white font-md px-5 py-3 rounded-md shadow font-poppins uppercase"
          size="lg"
        >
          Contact Us
        </Button>
        <button className="md:hidden p-2 rounded hover:bg-orange-100/10">
          <Menu className="text-white size-7" />
        </button>
      </div>
    </nav>
  );
}

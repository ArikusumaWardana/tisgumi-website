"use client";
import Link from "next/link";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "About Us", href: "#about" },
  { name: "Features", href: "#features" },
  { name: "Menu", href: "#menu" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <nav
        className={`w-full flex items-center justify-between px-4 md:px-8 font-poppins fixed top-0 left-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#10191b]/90 shadow-lg backdrop-blur py-4"
            : "bg-transparent py-4 md:py-6"
        }`}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/logo-tisgumi.webp"
            alt="Foodi Logo"
            width={40}
            height={40}
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <span className="text-xl md:text-2xl font-bold text-[#decb94] tracking-wide font-poppins">
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
            className="hidden md:flex bg-[#8e8e4b] hover:bg-[#8e8e4b]/80 text-white font-md px-5 py-3 rounded-md shadow font-poppins uppercase"
            size="lg"
            onClick={() => router.push("https://wa.me/+6285339307788")}
          >
            Contact Us
          </Button>
          <button
            className="md:hidden p-2 rounded hover:bg-orange-100/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="text-white size-7" />
            ) : (
              <Menu className="text-white size-7" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-30 bg-[#10191b]/95 backdrop-blur transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <ul className="flex flex-col items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-white text-2xl font-medium transition-colors hover:text-[#decb94]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Button
            className="bg-[#8e8e4b] hover:bg-[#8e8e4b]/80 text-white font-md px-8 py-4 rounded-md shadow font-poppins uppercase text-lg"
            size="lg"
            onClick={() => router.push("https://wa.me/+6285339307788")}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </>
  );
}

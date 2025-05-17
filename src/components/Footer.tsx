import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
} from "lucide-react";

const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Linkedin, href: "#" },
];

const userLinks = [
  { label: "Home", href: "#" },
  { label: "About Us", href: "#about" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Menu", href: "#menu" },
];

export default function Footer() {
  return (
    <footer className="bg-[#10191b] text-white pt-16 pb-6 px-4 mt-20 border-t border-[#222]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
        {/* Logo, desc, social */}
        <div className="flex flex-col gap-4 items-start">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src="/tisgumi-logo.webp"
              alt="Foodi Logo"
              width={40}
              height={40}
            />
            <span className="text-2xl font-bold text-[#8e8e4b] tracking-wide font-poppins">
              TISGUMI
            </span>
          </div>
          <p className="text-white/60 text-sm max-w-xs">
            Lorem ipsum dolor sit amet consectetur. Tristique cursus morbi nibh
            nec et vulputate. Turpis tortor nisi imperdiet quis accumsan. Ligula
            netus amet leo ultricies. Neque venenatis magnis amet eget sagittis
            leo enim.
          </p>
          <div className="flex gap-4 mt-2">
            {socialLinks.map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#8e8e4b] text-xl hover:bg-[#8e8e4b] hover:text-white transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon size={26} />
              </a>
            ))}
          </div>
        </div>
        {/* Opening Restaurant */}
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold mb-2 font-poppins">
            Opening Restaurant
          </span>
          <span className="text-white/70 text-sm">
            Sa – We: 09:00am - 10:00pm
          </span>
          <span className="text-white/70 text-sm">
            Thu – We: 09:00am - 10:00pm
          </span>
          <span className="text-white/70 text-sm">Friday Closed</span>
        </div>
        {/* User Link */}
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold mb-2 font-poppins">User Link</span>
          {userLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="text-white/70 text-sm hover:text-[#d18b47] transition"
            >
              {link.label}
            </a>
          ))}
        </div>
        {/* Contact Us & Subscribe */}
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold mb-2 font-poppins">
            Contact Us
          </span>
          <span className="text-white/70 text-sm flex items-center gap-2">
            <MapPin size={16} className="shrink-0" /> Jl. Gatot Subroto Tim.,
            Tonja, Kec. Denpasar Utara, Kota Denpasar, Bali
          </span>
          <span className="text-white/70 text-sm flex items-center gap-2">
            <MapPin size={16} className="shrink-0" /> Jl. Kartika Plaza, Kuta,
            Kec. Kuta, Kabupaten Badung, Bali
          </span>
          <span className="text-white/70 text-sm flex items-center gap-2">
            <MapPin size={16} className="shrink-0" /> Jl. Hasanuddin No.30, Dauh
            Puri Kangin, Kec. Denpasar Bar., Kota Denpasar, Bali
          </span>
          <span className="text-white/70 text-sm flex items-center gap-2">
            <Phone size={16} className="shrink-0" /> +62 812-3456-7890
          </span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-[#222] flex flex-col md:flex-row items-center justify-between gap-4 text-white/60 text-sm">
        <span>©2024 TISGUMI, All right reserved</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#8e8e4b] transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-[#8e8e4b] transition">
            Terms of Use
          </a>
        </div>
      </div>
    </footer>
  );
}

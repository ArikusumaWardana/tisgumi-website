import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tisgumi.vercel.app"),
  title: {
    default:
      "Tisgumi - Roti Canai & Teh Tarik Terbaik di Bali | UMKM Kuliner Denpasar",
    template: "%s | Tisgumi - Roti Canai & Teh Tarik Bali",
  },
  description:
    "Tisgumi adalah UMKM kuliner terpercaya di Denpasar, Bali yang menyajikan roti canai autentik, teh tarik, dan makanan India terbaik. Nikmati cheese naan, samosa, dan minuman tarik dengan delivery via GoFood. Lokasi strategis di Kartika Plaza, Gatot Subroto, dan Hasanuddin.",
  icons: {
    icon: "/logo-tisgumi.png",
  },
  keywords: [
    "tisgumi",
    "canai",
    "roti canai",
    "teh tarik",
    "kuliner bali",
    "UMKM bali",
    "rumah makan denpasar",
    "tempat makan bali",
    "makanan india bali",
    "cheese naan",
    "samosa",
    "dimsum",
    "nasi goreng",
    "indomie",
    "milo tarik",
    "kopi tarik",
    "taro tarik",
    "green tea tarik",
    "cokelat tarik",
    "pisang goreng",
    "tahu crispy",
    "ayam geprek",
    "ayam kalasan",
    "ayam rica",
    "sambal cumi",
    "nasi telor crispy",
    "gofood denpasar",
    "delivery makanan bali",
    "warung makan denpasar",
    "restoran halal bali",
    "makanan cepat saji bali",
    "snack bali",
    "minuman bali",
    "pusaka denpasar",
    "MSME bali",
    "bisnis kuliner denpasar",
    "food court bali",
    "mall food bali",
    "kartika plaza",
    "gatot subroto denpasar",
    "hasanuddin denpasar",
    "north denpasar",
    "kuta bali",
  ],
  openGraph: {
    title: "Tisgumi - Roti Canai & Teh Tarik Terbaik di Bali",
    description:
      "Nikmati roti canai autentik, teh tarik, dan makanan India terbaik di Tisgumi. UMKM kuliner terpercaya di Denpasar, Bali dengan delivery via GoFood. Cheese naan, samosa, dan minuman tarik favorit.",
    url: "https://tisgumi.vercel.app",
    siteName: "Tisgumi",
    images: [
      {
        url: "/logo-tisgumi.png",
        width: 1200,
        height: 630,
        alt: "Tisgumi - Roti Canai & Teh Tarik Bali",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tisgumi - Roti Canai & Teh Tarik Terbaik di Bali",
    description:
      "Nikmati roti canai autentik, teh tarik, dan makanan India terbaik di Tisgumi. UMKM kuliner terpercaya di Denpasar, Bali.",
    images: ["/logo-tisgumi.png"],
    creator: "@tisgumi",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://tisgumi.vercel.app",
  },
  other: {
    "geo.region": "ID-BA",
    "geo.placename": "Denpasar, Bali, Indonesia",
    "geo.position": "-8.6500;115.2167",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

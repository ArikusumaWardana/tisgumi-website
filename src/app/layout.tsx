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
  title: {
    default: "Tisgumi",
    template: "%s | Tisgumi",
  },
  description:
    "Tisgumi - Quick-serve culinary business in Denpasar, Bali offering affordable and practical meals",
  icons: {
    icon: "/tisgumi-logo.webp",
  },
  openGraph: {
    title: "Tisgumi",
    description:
      "Tisgumi - Quick-serve culinary business in Denpasar, Bali offering affordable and practical meals",
    url: "https://tisgumi.vercel.app",
    images: [
      {
        url: "/tisgumi-logo.webp",
        width: 1200,
        height: 630,
      },
    ],
    locale: "id_ID",
    type: "website",
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

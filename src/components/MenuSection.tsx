"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SubtitleWithLine from "@/components/ui/subtitleWithLine";
import Link from "next/link";

const menuData = [
  {
    id: 1,
    name: "Samosa Ayam",
    type: "food",
    img: "/background.webp",
    desc: "Spicy, Savory, Crispy",
  },
  {
    id: 2,
    name: "Cheese Naan",
    type: "food",
    img: "/background.webp",
    desc: "Cheesy, Fluffy, Warm",
  },
  {
    id: 3,
    name: "Roti Canai Cokelat",
    type: "food",
    img: "/background.webp",
    desc: "Sweet, Crispy, Fluffy",
  },
  {
    id: 4,
    name: "Roti Canai Cokelat Keju",
    type: "food",
    img: "/background.webp",
    desc: "Sweet, Creamy, Cheesy",
  },
  {
    id: 5,
    name: "Ayam Geprek",
    type: "food",
    img: "/background.webp",
    desc: "Spicy, Savory, Crispy",
  },
  {
    id: 6,
    name: "Dimsum",
    type: "food",
    img: "/background.webp",
    desc: "Savory, Crispy, Fluffy",
  },
  {
    id: 7,
    name: "Pisang Goreng Cokelat Keju",
    type: "food",
    img: "/background.webp",
    desc: "Sweet, Creamy, Cheesy",
  },
  {
    id: 8,
    name: "Tahu Crispy",
    type: "food",
    img: "/background.webp",
    desc: "Savory, Crispy, Fluffy",
  },
  {
    id: 9,
    name: "Nasi Goreng Ayam Kalasan",
    type: "food",
    img: "/background.webp",
    desc: "Spicy, Savory, Crispy",
  },
  {
    id: 10,
    name: "Nasi Goreng Ayam Rica",
    type: "food",
    img: "/background.webp",
    desc: "Spicy, Savory, Crispy",
  },
  {
    id: 11,
    name: "Nasi Goreng Sambal Cumi",
    type: "food",
    img: "/background.webp",
    desc: "Savory, Spicy, Crispy",
  },
  {
    id: 12,
    name: "Nasi Telor Crispy",
    type: "food",
    img: "/background.webp",
    desc: "Savory, Crispy, Fluffy",
  },
  {
    id: 13,
    name: "Indomie Goreng Telor",
    type: "food",
    img: "/background.webp",
    desc: "Savory, Crispy, Spicy",
  },
  {
    id: 14,
    name: "Indomie Kuah Telor",
    type: "food",
    img: "/background.webp",
    desc: "Savory, Creamy, Spicy",
  },
  {
    id: 15,
    name: "Indomie Goreng Oriental",
    type: "food",
    img: "/background.webp",
    desc: "Savory, Creamy, Spicy",
  },
  {
    id: 16,
    name: "Indomie Kuah Oriental",
    type: "food",
    img: "/background.webp",
    desc: "Savory, Creamy, Spicy",
  },
  {
    id: 17,
    name: "Teh Tarik",
    type: "drink",
    img: "/background.webp",
    desc: "Creamy, Sweet, Refreshing",
  },
  {
    id: 18,
    name: "Taro Tarik",
    type: "drink",
    img: "/background.webp",
    desc: "Creamy, Sweet, Refreshing",
  },
  {
    id: 19,
    name: "Green Tea Tarik",
    type: "drink",
    img: "/background.webp",
    desc: "Creamy, Sweet, Refreshing",
  },
  {
    id: 20,
    name: "Milo Tarik",
    type: "drink",
    img: "/background.webp",
    desc: "Creamy, Sweet, Refreshing",
  },
  {
    id: 21,
    name: "Kopi Tarik",
    type: "drink",
    img: "/background.webp",
    desc: "Creamy, Sweet, Refreshing",
  },
  {
    id: 22,
    name: "Cokelat Tarik",
    type: "drink",
    img: "/background.webp",
    desc: "Creamy, Sweet, Refreshing",
  },
];

const tabs = [
  { label: "All", value: "all" },
  { label: "Food", value: "food" },
  { label: "Drink", value: "drink" },
];

export default function MenuSection() {
  const [activeTab, setActiveTab] = useState("all");
  const filteredMenu =
    activeTab === "all"
      ? menuData
      : menuData.filter((item) => item.type === activeTab);

  return (
    <section className="w-full max-w-6xl mx-auto py-20 px-4" id="menu">
      <div className="flex flex-col items-center text-center mb-12">
        <SubtitleWithLine
          position="items-center"
          className="text-md text-white"
        >
          Menu
        </SubtitleWithLine>
        <h2 className="text-3xl md:text-4xl font-bold text-white font-poppins mb-4 md:mt-4">
          Explore Our Foods
        </h2>
        <p className="text-white/70 max-w-2xl font-poppins mb-6">
          Discover the authentic taste of our dishes, crafted with passion and
          fresh ingredients. Our menu offers a delightful variety that caters to
          every palate, ensuring a memorable dining experience. Join us and
          savor the flavors that make us unique.
        </p>
        <div className="flex gap-4 mb-4">
          {tabs.map((tab) => (
            <Button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-6 py-2 rounded-full font-poppins text-sm transition-all border border-[#8e8e4b] ${
                activeTab === tab.value
                  ? "bg-[#8e8e4b] text-white hover:bg-[#8e8e4b]/80"
                  : "bg-transparent text-[#8e8e4b] hover:bg-[#8e8e4b]/20"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {filteredMenu.map((item) => (
          <div
            key={item.id}
            className="bg-[#181f20] rounded-xs overflow-hidden shadow-lg flex flex-col transition-transform hover:-translate-y-1 hover:shadow-2xl min-w-0 w-full max-w-sm mx-auto"
          >
            <div className="relative w-full h-48 md:h-60">
              <Image
                src={item.img}
                alt={item.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={item.id === 1}
              />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-lg font-semibold text-[#8e8e4b] font-poppins mb-1">
                {item.name}
              </h3>
              <p className="text-xs text-white/60 mb-5 font-poppins">
                {item.desc}
              </p>
              <div className="mt-auto">
                <Link href="https://wa.me/628558070605" target="_blank">
                  <Button className="bg-[#8e8e4b] hover:bg-[#8e8e4b]/80 text-black font-semibold px-4 py-2 rounded font-poppins w-fit">
                    Order Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

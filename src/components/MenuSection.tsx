"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SubtitleWithLine from "@/components/ui/subtitleWithLine";

const menuData = [
  {
    id: 1,
    name: "Raspberry French Toast",
    type: "food",
    img: "/background.webp",
    desc: "Sweet, Fruity, Toast",
    price: 32000,
    oldPrice: 40000,
  },
  {
    id: 2,
    name: "Classic Burger & Fries",
    type: "food",
    img: "/background.webp",
    desc: "Juicy, Savory, Crispy",
    price: 35000,
    oldPrice: 42000,
  },
  {
    id: 3,
    name: "Veggie Salad Bowl",
    type: "food",
    img: "/background.webp",
    desc: "Fresh, Healthy, Green",
    price: 28000,
    oldPrice: 35000,
  },
  {
    id: 4,
    name: "Iced Coffee Latte",
    type: "drink",
    img: "/background.webp",
    desc: "Cold, Creamy, Coffee",
    price: 18000,
    oldPrice: 22000,
  },
  {
    id: 5,
    name: "Fresh Orange Juice",
    type: "drink",
    img: "/background.webp",
    desc: "Fresh, Citrus, Cool",
    price: 15000,
    oldPrice: 18000,
  },
];

const tabs = [
  { label: "All", value: "all" },
  { label: "Food", value: "food" },
  { label: "Drink", value: "drink" },
];

function formatRupiah(num: number) {
  return `Rp${num.toLocaleString("id-ID")}`;
}

export default function MenuSection() {
  const [activeTab, setActiveTab] = useState("all");
  const filteredMenu =
    activeTab === "all"
      ? menuData
      : menuData.filter((item) => item.type === activeTab);

  return (
    <section className="w-full max-w-6xl mx-auto py-20 px-4" id="menu">
      <div className="flex flex-col items-center text-center mb-12">
        <SubtitleWithLine position="items-center" className="text-md text-white">Menu</SubtitleWithLine>
        <h2 className="text-3xl md:text-4xl font-bold text-white font-poppins mb-4 md:mt-4">
          Explore Our Foods
        </h2>
        <p className="text-white/70 max-w-2xl font-poppins mb-6">
          Lorem ipsum dolor sit amet consectetur. Dolor elit vitae nunc varius.
          Facilisis eget cras sit semper sit enim. Turpis aliquet at ac eu donec
          ut. Sagittis vestibulum at quis non massa netus.
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
              <p className="text-xs text-white/60 mb-2 font-poppins">
                {item.desc}
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold text-[#8e8e4b] font-poppins">
                  {formatRupiah(item.price)}
                </span>
                <span className="text-base line-through text-white/40 font-poppins">
                  {formatRupiah(item.oldPrice)}
                </span>
              </div>
              <div className="mt-auto">
                <Button className="bg-[#8e8e4b] hover:bg-[#8e8e4b]/80 text-black font-semibold px-4 py-2 rounded font-poppins w-fit">
                  Order Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import { Quote } from "lucide-react";
import SubtitleWithLine from "./ui/subtitleWithLine";

const testimonials = [
  {
    text: "Mantap banget! Makanan khas India dengan taste otentik. Cheese Naan nya mantap dengan taste keju yg mantap. Teh tariknya betul2 otentik.",
    rating: 5,
    name: "Denny Darmadji",
    role: "Customer",
    color: "#fbbf24", // yellow
  },
  {
    text: "Kami pesan canai susu, donuts tepung gula, dan teh tarik.. ini sudah datang kedua kalinya disini. Rasanya original dan suasana juga cozy.",
    rating: 5,
    name: "William Halim",
    role: "Customer",
    color: "#ef4444", // red
  },
  {
    text: "Cheese Naannya enak ada keju moza di dalamnya dan teh tarik rasanya pas dilidah tidak manis tapi creamy banget. recommended banget.",
    rating: 5,
    name: "Ivan Tjong",
    role: "Customer",
    color: "#a21caf", // purple
  },
];

function StarRating({ count, color }: { count: number; color: string }) {
  return (
    <div className="flex gap-1 justify-center mb-2">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          width={18}
          height={18}
          fill={i < count ? color : "#444"}
          viewBox="0 0 20 20"
        >
          <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,18.99 10,15.27 4.18,18.99 6,12.14 0.49,7.64 7.41,7.36" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="w-full max-w-6xl mx-auto py-20 px-4">
      <div className="flex flex-col items-center text-center mb-12">
        <SubtitleWithLine position="items-center" className="text-sm text-white">Testimonials</SubtitleWithLine>
        <h2 className="text-3xl md:text-4xl font-bold text-white font-poppins mb-4 mt-2 md:mt-4">
          Why people choose us?
        </h2>
        <p className="text-white/70 max-w-2xl font-poppins">
          Discover the reasons why our clients trust us. Our commitment to excellence and attention to detail ensure that every experience is exceptional. Join the community of satisfied customers who have chosen us for our reliability and quality.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="relative bg-[#10191b] rounded-xl p-8 shadow-md flex flex-col items-center text-center min-h-[260px]"
          >
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#181f20] w-14 h-14 flex items-center justify-center rounded-full shadow-lg">
              <Quote size={28} className="text-[#8e8e4b]" />
            </div>
            <p className="text-white/80 font-poppins mt-8 mb-4">{t.text}</p>
            <StarRating count={t.rating} color={t.color} />
            <div className="mt-2">
              <span className="block text-white font-bold font-poppins">
                {t.name}
              </span>
              <span className="block text-xs text-white/50 font-poppins">
                {t.role}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination dots */}
      <div className="flex justify-center gap-2">
        <span className="w-3 h-3 rounded-full bg-[#8e8e4b]" />
        <span className="w-3 h-3 rounded-full bg-white/20" />
        <span className="w-3 h-3 rounded-full bg-white/20" />
      </div>
    </section>
  );
}

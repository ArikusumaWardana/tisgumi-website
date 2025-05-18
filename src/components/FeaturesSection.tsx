import { Utensils, Leaf, Gift } from "lucide-react";
import SubtitleWithLine  from "./ui/subtitleWithLine";

const features = [
  {
    icon: Utensils,
    title: "Menu for Every Taste",
    desc: "From classic Teh Tarik to flavorful snacks, our menu is thoughtfully crafted to please every craving—sweet or savory.",
  },
  {
    icon: Leaf,
    title: "Premium Ingredients",
    desc: "We use only high-quality tea, fresh milk, and natural ingredients to serve the perfect cup of Teh Tarik every time.",
  },
  {
    icon: Gift,
    title: "Signature Experience",
    desc: "Enjoy more than just a drink. Tisgumi offers a vibrant atmosphere and a signature experience that keeps you coming back.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full max-w-6xl mx-auto py-20 px-4" id="features">
      <div className="flex flex-col items-center text-center mb-12">
        <SubtitleWithLine position="items-center" className="text-sm text-white">Features</SubtitleWithLine>
        <h2 className="text-3xl md:text-4xl font-bold text-white font-poppins mb-4 mt-2 md:mt-4">
          Why people choose us?
        </h2>
        <p className="text-white/70 max-w-2xl font-poppins">
          We offer a diverse menu, premium ingredients, and a team of
          experienced baristas and chefs dedicated to delivering the best
          culinary experience for every guest.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center p-8 h-full"
          >
            <feature.icon className="text-[#8e8e4b] mb-4 md:mb-8" size={48} />
            <h3 className="text-xl font-semibold text-white font-poppins mb-2 md:mb-4">
              {feature.title}
            </h3>
            <p className="text-white/70 font-poppins text-center">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

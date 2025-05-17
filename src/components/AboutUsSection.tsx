import Image from "next/image";
import SubtitleWithLine from "./ui/subtitleWithLine";

const aboutData = [
  {
    title: "Discover TISGUMI",
    subtitle: "ABOUT US",
    desc: "TISGUMI is a quick-serve culinary business in Denpasar, Bali, offering affordable and practical meals. As part of the Pusaka Denpasar MSME network, it collaborates with local partners to support the city's business growth. Conveniently located in North Denpasar, it's a great spot to enjoy tasty food near major shopping centers.",
    img: "/background.webp",
  },
  {
    title: "Signature Dishes & Menu Variety",
    subtitle: "OUR MENU",
    desc: "Our signature dish, Grilled Chicken with Rice, is a favorite at just Rp32,000. TISGUMI also offers a wide selection of food and beverages, including snacks, coffee, and refreshing drinks—perfect for any time of day. Enjoy our menu in-store or order conveniently through GoFood for a quick and tasty meal wherever you are.",
    img: "/background.webp",
  },
  {
    title: "Meet the TISGUMI Team",
    subtitle: "OUR TEAM",
    desc: "TISGUMI is driven by a creative and resilient team of 11–50 people. We're seeking passionate Team Leaders with marketing, training skills, and a love for snacks. Grow with us!",
    img: "/background.webp",
  },
];

export default function AboutUsSection() {
  return (
    <section className="w-full max-w-6xl mx-auto py-20 grid gap-12" id="about">
      {/* Row 1 */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-4 order-1 max-w-md">
          <SubtitleWithLine className="text-sm text-white/70">{aboutData[0].subtitle}</SubtitleWithLine>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-poppins mb-2">
            {aboutData[0].title}
          </h2>
          <p className="text-white/80 font-poppins mb-4">{aboutData[0].desc}</p>
        </div>
        <div className="order-2">
          <Image
            src={aboutData[0].img}
            alt="about us"
            width={600}
            height={400}
            className="object-cover w-full h-96"
          />
        </div>
      </div>
      {/* Row 2 */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="order-2 md:order-1">
          <Image
            src={aboutData[1].img}
            alt="our menu"
            width={600}
            height={400}
            className="object-cover w-full h-96"
          />
        </div>
        <div className="flex flex-col gap-4 order-1 md:order-2 max-w-md md:ms-15">
          <SubtitleWithLine className="text-sm text-white/70">{aboutData[1].subtitle}</SubtitleWithLine>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-poppins mb-2">
            {aboutData[1].title}
          </h2>
          <p className="text-white/80 font-poppins mb-4">{aboutData[1].desc}</p>
        </div>
      </div>
      {/* Row 3 */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-4 order-1 max-w-md">
          <SubtitleWithLine className="text-sm text-white/70">{aboutData[2].subtitle}</SubtitleWithLine>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-poppins mb-2">
            {aboutData[2].title}
          </h2>
          <p className="text-white/80 font-poppins mb-4">{aboutData[2].desc}</p>
        </div>
        <div className="order-2">
          <Image
            src={aboutData[2].img}
            alt="our team"
            width={600}
            height={400}
            className="object-cover w-full h-96"
          />
        </div>
      </div>
    </section>
  );
}

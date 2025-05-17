import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-screen h-[100vh] bg-cover bg-center px-4 font-poppins"
      style={{ backgroundImage: "url(/background.webp)" }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="relative z-10 flex flex-col items-center justify-center text-center gap-4">
        <span className="text-white text-lg md:text-xl font-md tracking-wide mb-2">
          GLAD TO SEE YOU HERE!
        </span>
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-8 tracking-tight">
          DELICIOUS MOMENTS AWAIT
        </h1>
        <div className="flex mt-2">
          <Button
            className="bg-transparent border border-white text-white font-semibold px-5 py-5 rounded-md shadow hover:bg-white/10 font-poppins uppercase"
            size="lg"
          >
            Check Our Menu
          </Button>
          <Button
            variant="ghost"
            className="text-white font-semibold px-8 py-3 rounded-md hover:text-[#decb94] hover:bg-transparent font-poppins uppercase"
            size="lg"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}

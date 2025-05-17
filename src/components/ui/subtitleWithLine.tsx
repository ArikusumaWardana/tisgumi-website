export default function SubtitleWithLine({ position, className, children }: { position?: string, className?: string, children: React.ReactNode }) {
  return (
    <div className={`flex flex-col ${position} mb-2`}>
      <span className={`tracking-widest font-poppins uppercase ${className}`}>
        {children}
      </span>
      <span className="w-10 h-0.5 bg-[#8e8e4b] mt-2 rounded-sm" />
    </div>
  );
}

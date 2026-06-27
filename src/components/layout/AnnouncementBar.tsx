export default function AnnouncementBar() {
  return (
    <div className="bg-[#0a0a0a] text-white text-xs font-body py-2.5 px-4 flex items-center justify-between overflow-hidden">
      <div className="flex items-center gap-6">
        <span className="flex items-center gap-1.5">
          <span className="text-[#FF69B4]">♡</span>
          <span className="tracking-widest uppercase font-medium">Hand-Braided</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-[#FF69B4]">♡</span>
          <span className="tracking-widest uppercase font-medium">Small Batch</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-[#AAFF00]">✦</span>
          <span className="tracking-widest uppercase font-medium">One-of-One</span>
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-1.5">
        <span className="text-[#AAFF00] font-bold tracking-widest uppercase text-xs">
          Confidence Card Included
        </span>
        <span className="text-white/50">—</span>
        <span className="tracking-wider text-white/80">With Every Order</span>
      </div>
    </div>
  );
}

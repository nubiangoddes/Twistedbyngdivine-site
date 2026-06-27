const PACKAGING_IMAGE = 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=700&fit=crop&q=80';

const FEATURES = [
  { icon: '✦', title: 'Collectible', desc: 'Each card is a limited edition design.' },
  { icon: '♡', title: 'Hand-Numbered', desc: 'Every card is individually numbered.' },
  { icon: '✿', title: 'Randomly Selected', desc: 'Your card chooses you.' },
  { icon: '✧', title: 'Surprise Inside', desc: 'Discover yours when you open your order.' },
];

export default function ConfidenceSection() {
  return (
    <section className="bg-blush py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative */}
      <span className="absolute top-8 right-[10%] text-[#FF1493]/20 text-[120px] font-display pointer-events-none select-none leading-none">♡</span>
      <span className="absolute bottom-8 left-[5%] text-[#AAFF00]/15 text-[80px] font-display pointer-events-none select-none leading-none">✦</span>

      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3' }}>
              <img
                src={PACKAGING_IMAGE}
                alt="Confidence Card Packaging"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF1493]/20 to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-[#0D0D00] text-white rounded-2xl p-5 shadow-xl border border-[#FF1493]/30">
              <p className="font-display text-[#FF1493] text-xl">SURPRISE</p>
              <p className="text-white/60 text-xs tracking-widest uppercase mt-1">Inside Every Order</p>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <p className="text-[#FF69B4] tracking-[0.3em] uppercase text-xs font-medium mb-4">✦ Every Order Includes ✦</p>
            <h2 className="font-display text-[#0D0D00] text-[clamp(2rem,4vw,3.5rem)] tracking-tight leading-none mb-6">
              EVERY ORDER<br />INCLUDES<br />
              <span className="text-[#FF1493]">CONFIDENCE.</span>
            </h2>
            <p className="text-[#0D0D00]/60 font-body text-base leading-relaxed mb-10">
              Inside every package is a randomly selected collectible Confidence Card designed to remind you who you are.
            </p>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-5">
              {FEATURES.map(f => (
                <div key={f.title} className="bg-white rounded-xl p-5 border border-[#FF69B4]/20 shadow-sm hover:shadow-md hover:border-[#FF1493]/40 transition-all duration-200">
                  <span className="text-[#FF1493] text-xl block mb-2">{f.icon}</span>
                  <h4 className="font-semibold text-[#0D0D00] text-sm mb-1">{f.title}</h4>
                  <p className="text-[#0D0D00]/50 text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-[#0D0D00]/40 text-xs italic font-editorial">
              Card designs are never revealed in advance — the surprise is part of the experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

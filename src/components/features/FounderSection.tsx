import founderImg from '@/assets/founder.png';
const FOUNDER_IMAGE = founderImg;

export default function FounderSection() {
  return (
    <section id="founder" className="bg-[#0D0D00] py-24 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <p className="text-[#AAFF00] tracking-[0.3em] uppercase text-xs font-medium mb-4">✦ The Founder ✦</p>
            <h2 className="font-display text-white text-[clamp(2.5rem,5vw,4.5rem)] tracking-tight leading-none mb-8">
              MEET<br />
              <span className="text-[#FF1493]">NATASHA</span><br />
              DYSON
            </h2>

            <div className="space-y-5">
              <p className="text-white/70 font-body text-base leading-relaxed">
                What started as a creative experiment became a confidence movement.
              </p>
              <p className="text-white/70 font-body text-base leading-relaxed">
                Twisted by NG Divine was created to transform everyday materials into wearable art that celebrates bold self-expression.
              </p>
              <p className="text-white/70 font-body text-base leading-relaxed">
                Each pair is handmade, one-of-a-kind, and designed for people who refuse to blend in.
              </p>
            </div>

            {/* Signature line */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="font-editorial italic text-[#FF69B4] text-2xl">Natasha Dyson</p>
              <p className="text-white/30 text-xs tracking-widest uppercase mt-1">Founder & Creative Director</p>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-[#FF1493]/50 rounded-tl-2xl" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-[#AAFF00]/50 rounded-br-2xl" />

              <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '3/4' }}>
                <img
                  src={FOUNDER_IMAGE}
                  alt="Natasha Dyson — Founder of Twisted by NG Divine"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating quote */}
            <div className="absolute -bottom-6 left-6 right-6 bg-gradient-to-r from-[#FF1493] to-[#BF00FF] rounded-xl p-4 shadow-xl">
              <p className="text-white font-editorial italic text-sm text-center">
                "Wearable confidence for people who refuse to blend in."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

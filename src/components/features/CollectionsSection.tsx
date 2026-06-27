import { useNavigate } from 'react-router-dom';
import { COLLECTIONS } from '@/constants/collections';

export default function CollectionsSection() {
  const navigate = useNavigate();

  return (
    <section id="collections" className="bg-[#111100] py-24 px-4 sm:px-6">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto mb-16 text-center">
        <p className="text-[#FF69B4] tracking-[0.3em] uppercase text-xs font-medium mb-3">✦ The Collections ✦</p>
        <h2 className="font-display text-white text-[clamp(2.5rem,6vw,5rem)] tracking-tight">
          CHOOSE YOUR COLOR STORY
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#FF1493] to-[#AAFF00] mx-auto mt-6 rounded-full" />
      </div>

      {/* Cards */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        {COLLECTIONS.map((col, idx) => (
          <div
            key={col.slug}
            className="group relative overflow-hidden rounded-2xl cursor-pointer w-full"
            style={{ minHeight: '520px' }}
            onClick={() => navigate(`/collections/${col.slug}`)}
          >
            {/* Image */}
            <img
              src={col.image}
              alt={col.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 transition-all duration-500" />

            {/* Top number */}
            <div className="absolute top-6 left-6">
              <span className="font-editorial italic text-[#FF69B4] text-sm font-medium tracking-wider">{col.number}</span>
            </div>

            {/* Accent corner */}
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full border-2 border-[#AAFF00]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[#AAFF00] text-xs">✦</span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <h3 className="font-display text-white text-3xl tracking-tight mb-1">{col.name}</h3>
              <p className="font-editorial italic text-[#FF69B4] text-base mb-4">{col.tagline}</p>

              {/* Color stories */}
              <div className="mb-6 space-y-1.5">
                <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-2">Color Stories</p>
                {col.colorStories.map(cs => (
                  <div key={cs.id} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#FF69B4] shrink-0" />
                    <span className="text-white/70 text-xs font-medium">{cs.name}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button className="w-full bg-[#FF1493] hover:bg-[#e0127f] text-white font-body font-semibold text-xs tracking-[0.15em] uppercase py-3.5 rounded-full transition-all duration-200 group-hover:shadow-lg group-hover:shadow-[#FF1493]/30">
                Explore Collection →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import heroImg from '@/assets/hero-main.png';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function HeroSection() {
  return (
    <section className="relative w-full" style={{ background: '#fce4ec' }}>
      <div className="relative w-full">
        {/* Full-width image — no cropping, full aspect ratio preserved */}
        <img
          src={heroImg}
          alt="Twisted by NG Divine — Designed To Bend The Rules"
          className="w-full block"
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />

        {/* ── Earrings click zone (right half) ── */}
        <button
          aria-label="Shop Collections"
          onClick={() => scrollTo('collections')}
          className="absolute cursor-pointer"
          style={{
            top: '5%',
            left: '38%',
            width: '62%',
            height: '90%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            zIndex: 8,
          }}
        />

        {/* ── CTA Buttons — positioned below "Wear The Unexpected." / description ── */}
        {/* On the new image these sit roughly 78–90% down the left column */}
        <div
          className="absolute flex flex-row gap-2 sm:gap-3"
          style={{
            bottom: '5%',
            left: '2%',
            zIndex: 20,
          }}
        >
          {/* Button 1 — Find Your Twist */}
          <button
            onClick={() => scrollTo('find-your-twist')}
            className="group relative overflow-hidden font-bold tracking-widest uppercase text-white rounded-full transition-all duration-200 hover:scale-105"
            style={{
              background: '#FF1493',
              padding: 'clamp(8px,1.5vw,14px) clamp(14px,2.5vw,26px)',
              fontSize: 'clamp(0.6rem, 1.4vw, 0.82rem)',
              letterSpacing: '0.12em',
              boxShadow: '0 4px 20px rgba(255,20,147,0.5)',
              whiteSpace: 'nowrap',
            }}
          >
            <span className="relative z-10">FIND YOUR TWIST →</span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>

          {/* Button 2 — Shop Collections */}
          <button
            onClick={() => scrollTo('collections')}
            className="group relative overflow-hidden font-bold tracking-widest uppercase rounded-full border-2 transition-all duration-200 hover:scale-105"
            style={{
              background: 'rgba(0,0,0,0.18)',
              borderColor: '#AAFF00',
              color: '#AAFF00',
              padding: 'clamp(6px,1.3vw,12px) clamp(12px,2.2vw,22px)',
              fontSize: 'clamp(0.6rem, 1.4vw, 0.82rem)',
              letterSpacing: '0.12em',
              backdropFilter: 'blur(4px)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#AAFF00';
              (e.currentTarget as HTMLButtonElement).style.color = '#000';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.18)';
              (e.currentTarget as HTMLButtonElement).style.color = '#AAFF00';
            }}
          >
            <span className="relative z-10">SHOP COLLECTIONS →</span>
          </button>
        </div>
      </div>
    </section>
  );
}

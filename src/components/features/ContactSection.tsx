export default function ContactSection() {
  return (
    <section id="contact" className="bg-[#0D0D00] py-24 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#AAFF00] tracking-[0.3em] uppercase text-xs font-medium mb-3">✦ Reach Out ✦</p>
          <h2 className="font-display text-white text-[clamp(2.5rem,6vw,5rem)] tracking-tight">
            LET'S GET
            <span className="text-[#FF1493]"> TWISTED</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <a
            href="mailto:twistedbyngdivine@gmail.com"
            className="group bg-[#111100] border border-white/10 hover:border-[#FF1493]/50 rounded-2xl p-8 text-center transition-all duration-200 hover:bg-[#1a1900]"
          >
            <span className="text-[#FF1493] text-3xl block mb-4">✉</span>
            <p className="text-white/40 text-[10px] tracking-widest uppercase mb-2">Email</p>
            <p className="text-white text-sm font-medium group-hover:text-[#FF69B4] transition-colors break-all">twistedbyngdivine@gmail.com</p>
          </a>

          <a
            href="https://instagram.com/nubiancolourgoddess"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#111100] border border-white/10 hover:border-[#FF69B4]/50 rounded-2xl p-8 text-center transition-all duration-200 hover:bg-[#1a1900]"
          >
            <span className="text-[#FF69B4] text-3xl block mb-4">◈</span>
            <p className="text-white/40 text-[10px] tracking-widest uppercase mb-2">Instagram</p>
            <p className="text-white text-sm font-medium group-hover:text-[#FF69B4] transition-colors">@nubiancolourgoddess</p>
          </a>

          <a
            href="https://tiktok.com/@natashadyson6"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#111100] border border-white/10 hover:border-[#AAFF00]/50 rounded-2xl p-8 text-center transition-all duration-200 hover:bg-[#1a1900]"
          >
            <span className="text-[#AAFF00] text-3xl block mb-4">◉</span>
            <p className="text-white/40 text-[10px] tracking-widest uppercase mb-2">TikTok</p>
            <p className="text-white text-sm font-medium group-hover:text-[#AAFF00] transition-colors">@natashadyson6</p>
          </a>
        </div>
      </div>
    </section>
  );
}

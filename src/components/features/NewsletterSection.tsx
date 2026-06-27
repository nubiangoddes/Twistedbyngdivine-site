import { useState } from 'react';
import { toast } from 'sonner';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmail('');
      toast.success('Welcome to the Twisted List! ✦');
    }, 800);
  }

  return (
    <section className="relative overflow-hidden py-24 px-4 sm:px-6" style={{ background: 'linear-gradient(135deg, #FF1493 0%, #BF00FF 60%, #0D0D00 100%)' }}>
      {/* Decorative */}
      <span className="absolute top-6 left-[8%] text-white/10 text-[200px] font-display pointer-events-none select-none leading-none">✦</span>
      <span className="absolute bottom-0 right-[5%] text-white/10 text-[150px] font-display pointer-events-none select-none leading-none">♡</span>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <span className="inline-block bg-white/20 text-white text-xs tracking-[0.3em] uppercase px-4 py-2 rounded-full mb-6 font-medium">
          ✦ The Twisted List ✦
        </span>
        <h2 className="font-display text-white text-[clamp(2.5rem,6vw,5rem)] tracking-tight leading-none mb-6">
          JOIN THE<br />TWISTED LIST
        </h2>
        <p className="text-white/80 font-body text-base leading-relaxed mb-10">
          New drops. Confidence Cards. Exclusive surprises.<br />
          Behind-the-scenes magic.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="flex-1 bg-white/10 border border-white/30 text-white placeholder-white/50 rounded-full px-6 py-4 text-sm font-body focus:outline-none focus:border-white focus:bg-white/15 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-[#FF1493] hover:bg-[#AAFF00] hover:text-[#0D0D00] font-body font-bold text-sm tracking-widest uppercase px-8 py-4 rounded-full transition-all duration-200 disabled:opacity-60 shrink-0"
          >
            {loading ? '...' : 'Join The List'}
          </button>
        </form>

        <p className="text-white/40 text-xs mt-4 font-editorial italic">
          No spam. Only twists worth opening.
        </p>
      </div>
    </section>
  );
}

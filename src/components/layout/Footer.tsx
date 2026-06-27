import { Link, useNavigate } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { COLLECTIONS } from '@/constants/collections';

export default function Footer() {
  const navigate = useNavigate();

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 400);
    }
  }

  return (
    <footer className="bg-[#0D0D00] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full border-2 border-[#FF1493] flex items-center justify-center">
                <span className="font-editorial italic text-[#FF1493] text-sm font-bold">NG</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-white text-xl tracking-wider">TWISTED</span>
                <span className="font-body text-[#AAFF00] text-[9px] tracking-[0.25em] uppercase font-medium">by NG Divine</span>
              </div>
            </div>
            <p className="font-editorial italic text-white/50 text-sm mb-6">Designed To Bend The Rules.</p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/nubiancolourgoddess"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[#FF1493] hover:border-[#FF1493] transition-all"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.tiktok.com/@natashadyson6"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[#FF1493] hover:border-[#FF1493] transition-all"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.73a8.17 8.17 0 0 0 4.77 1.53V6.79a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium tracking-widest uppercase text-xs mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><button onClick={() => scrollToSection('collections')} className="text-white/50 hover:text-[#FF69B4] text-sm transition-colors">Shop All</button></li>
              {COLLECTIONS.map(col => (
                <li key={col.slug}>
                  <Link to={`/collections/${col.slug}`} className="text-white/50 hover:text-[#FF69B4] text-sm transition-colors">
                    {col.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/order-status" className="text-white/50 hover:text-[#FF69B4] text-sm transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <button onClick={() => scrollToSection('faq')}
                  className="text-white/50 hover:text-[#FF69B4] text-sm transition-colors">FAQ</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('contact')}
                  className="text-white/50 hover:text-[#FF69B4] text-sm transition-colors">Contact</button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium tracking-widest uppercase text-xs mb-6">Get In Touch</h4>
            <div className="space-y-3">
              <p className="text-white/50 text-sm">
                <span className="text-[#FF69B4]">Email</span><br />
                <a href="mailto:twistedbyngdivine@gmail.com" className="hover:text-white transition-colors">twistedbyngdivine@gmail.com</a>
              </p>
              <p className="text-white/50 text-sm">
                <span className="text-[#FF69B4]">Instagram</span><br />
                <a href="https://instagram.com/nubiancolourgoddess" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@nubiancolourgoddess</a>
              </p>
              <p className="text-white/50 text-sm">
                <span className="text-[#FF69B4]">TikTok</span><br />
                <a href="https://www.tiktok.com/@natashadyson6" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@natashadyson6</a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs tracking-wider">
            © {new Date().getFullYear()} Twisted by NG Divine. All rights reserved.
          </p>
          <p className="text-white/20 text-xs font-editorial italic">Designed To Bend The Rules.</p>
        </div>
      </div>
    </footer>
  );
}

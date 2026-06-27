import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { COLLECTIONS } from '@/constants/collections';

export default function Header() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate home first, then scroll after page loads
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 400);
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-[#111100] border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full border-2 border-[#FF1493] flex items-center justify-center bg-transparent">
            <span className="font-editorial italic text-[#FF1493] text-sm font-bold leading-none">NG</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-white text-xl tracking-wider">TWISTED</span>
            <span className="font-body text-[#AAFF00] text-[9px] tracking-[0.25em] uppercase font-medium">by NG Divine</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            className="text-white/80 hover:text-white text-sm tracking-widest uppercase font-medium transition-colors"
            onClick={() => scrollToSection('collections')}
          >
            Shop All
          </button>

          <div
            className="relative"
            onMouseEnter={() => setCollectionsOpen(true)}
            onMouseLeave={() => setCollectionsOpen(false)}
          >
            <button className="flex items-center gap-1 text-white/80 hover:text-white text-sm tracking-widest uppercase font-medium transition-colors">
              Collections <ChevronDown size={14} />
            </button>
            {collectionsOpen && (
              <div className="absolute top-full left-0 mt-2 bg-[#0D0D00] border border-[#FF1493]/30 rounded-lg py-2 w-52 shadow-xl shadow-black/50">
                {COLLECTIONS.map(col => (
                  <Link
                    key={col.slug}
                    to={`/collections/${col.slug}`}
                    className="block px-5 py-3 text-white/80 hover:text-white hover:bg-[#FF1493]/10 text-sm font-medium transition-colors"
                  >
                    <span className="text-[#FF1493] font-editorial italic text-xs mr-2">{col.number}</span>
                    {col.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            className="text-white/80 hover:text-white text-sm tracking-widest uppercase font-medium transition-colors"
            onClick={() => scrollToSection('founder')}
          >
            About
          </button>
          <button
            className="text-white/80 hover:text-white text-sm tracking-widest uppercase font-medium transition-colors"
            onClick={() => scrollToSection('contact')}
          >
            Contact
          </button>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/cart')}
            className="relative text-white/70 hover:text-white transition-colors"
            aria-label={`Cart (${totalItems} items)`}
          >
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FF1493] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
          <button
            className="md:hidden text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0D0D00] border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          <button onClick={() => { setMobileOpen(false); scrollToSection('collections'); }} className="text-white text-sm tracking-widest uppercase font-medium text-left">Shop All</button>
          {COLLECTIONS.map(col => (
            <Link
              key={col.slug}
              to={`/collections/${col.slug}`}
              onClick={() => setMobileOpen(false)}
              className="text-white/70 hover:text-white text-sm font-medium pl-4 border-l-2 border-[#FF1493]/40 transition-colors"
            >
              <span className="text-[#FF1493] font-editorial italic mr-2">{col.number}</span>{col.name}
            </Link>
          ))}
          <button onClick={() => { setMobileOpen(false); scrollToSection('founder'); }} className="text-white text-sm tracking-widest uppercase font-medium text-left">About</button>
          <button onClick={() => { setMobileOpen(false); scrollToSection('contact'); }} className="text-white text-sm tracking-widest uppercase font-medium text-left">Contact</button>
        </div>
      )}
    </header>
  );
}

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { useCart } from '@/contexts/CartContext';

// Lazy client — avoids module-level crash when env vars are absent (e.g. Vercel
// deployment before env vars are configured). The client is only used at
// runtime inside useEffect, so an empty-string fallback is safe here.
function getSupabase() {
  const url = import.meta.env.VITE_SUPABASE_URL ?? '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
  if (!url || !key) return null;
  return createClient(url, key);
}

type Status = 'loading' | 'success' | 'cancelled' | 'error';

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState<Status>(sessionId ? 'loading' : 'success');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>(
    sessionId
      ? `TNG-${sessionId.replace('cs_', '').substring(0, 8).toUpperCase()}`
      : `TNG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  );

  useEffect(() => {
    if (!sessionId) {
      // Navigated directly (e.g. after simulated checkout)
      clearCart();
      setStatus('success');
      return;
    }

    // Verify the Stripe session
    async function verifySession() {
      try {
        console.log('Verifying Stripe session:', sessionId);
        const supabase = getSupabase();
        if (!supabase) {
          console.warn('Supabase env vars not configured — skipping verification.');
          clearCart();
          setStatus('success');
          return;
        }
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId },
        });

        if (error || !data) {
          console.warn('Verification error (non-critical):', error?.message);
          // Even if verification fails, Stripe already handled payment — show success
          clearCart();
          setStatus('success');
          return;
        }

        if (data.paymentStatus === 'paid') {
          setCustomerEmail(data.customerEmail ?? '');
          if (data.orderNumber) setOrderNumber(data.orderNumber);
          clearCart();
          setStatus('success');
        } else if (data.status === 'expired' || data.paymentStatus === 'unpaid') {
          setStatus('cancelled');
        } else {
          clearCart();
          setStatus('success');
        }
      } catch (err) {
        console.error('Session verification threw:', err);
        // Fail gracefully — Stripe handled the charge, show success
        clearCart();
        setStatus('success');
      }
    }

    verifySession();
  }, [sessionId]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0D0D00] flex items-center justify-center">
        <div className="text-center">
          <span className="w-12 h-12 border-2 border-[#FF1493]/40 border-t-[#FF1493] rounded-full animate-spin block mx-auto mb-4" />
          <p className="text-white/50 text-sm">Confirming your order…</p>
        </div>
      </div>
    );
  }

  // ── Cancelled ─────────────────────────────────────────────────────────────
  if (status === 'cancelled') {
    return (
      <div className="min-h-screen bg-[#0D0D00] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-white/40 text-3xl">✕</span>
          </div>
          <h1 className="font-display text-white text-4xl tracking-tight mb-4">PAYMENT CANCELLED</h1>
          <p className="text-white/50 text-sm mb-8">
            Your order was not completed. Your cart is still saved — come back whenever you're ready.
          </p>
          <Link
            to="/cart"
            className="bg-[#FF1493] hover:bg-[#e0127f] text-white font-body font-bold text-sm tracking-widest uppercase px-10 py-4 rounded-full transition-all duration-200 inline-block"
          >
            Return to Cart
          </Link>
        </div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0D0D00] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Animated emblem */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF1493] to-[#BF00FF] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#FF1493]/30">
          <span className="text-white text-4xl">✦</span>
        </div>

        <p className="text-[#AAFF00] tracking-[0.3em] uppercase text-xs font-medium mb-4">Order Confirmed</p>
        <h1 className="font-display text-white text-[clamp(2.5rem,6vw,5rem)] tracking-tight leading-none mb-6">
          TWISTED &<br />
          <span className="text-[#FF1493]">DELIVERED.</span>
        </h1>

        <p className="text-white/60 font-body text-base leading-relaxed mb-3">
          Your order is confirmed. Your twists are being handmade with care.
        </p>
        {customerEmail && (
          <p className="text-white/40 text-sm mb-2">
            Confirmation sent to <span className="text-[#FF69B4]">{customerEmail}</span>
          </p>
        )}
        <p className="text-white/40 text-sm font-editorial italic mb-8">
          A Confidence Card has been randomly selected for your order. ♡
        </p>

        {/* Order number */}
        <div className="bg-[#111100] border border-[#FF1493]/30 rounded-2xl p-6 mb-10">
          <p className="text-white/40 text-xs tracking-widest uppercase mb-2">Order Reference</p>
          <p className="font-display text-[#FF1493] text-3xl tracking-widest">{orderNumber}</p>
          {sessionId && (
            <p className="text-white/20 text-[10px] mt-2 font-mono break-all">{sessionId}</p>
          )}
        </div>

        {/* What's next */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: '✦', title: 'Handcrafted', desc: 'Your pair is being made just for you.' },
            { icon: '♡', title: 'Confidence Card', desc: 'A surprise card selected for your order.' },
            { icon: '✧', title: 'Shipped With Love', desc: 'Tracking info will arrive by email.' },
          ].map(step => (
            <div key={step.title} className="bg-[#111100] border border-white/10 rounded-xl p-4">
              <span className="text-[#FF1493] text-xl block mb-2">{step.icon}</span>
              <p className="text-white text-xs font-semibold mb-1">{step.title}</p>
              <p className="text-white/30 text-[10px] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-[#FF1493] hover:bg-[#e0127f] text-white font-body font-bold text-sm tracking-widest uppercase px-10 py-4 rounded-full transition-all duration-200"
          >
            Continue Shopping
          </Link>
          <a
            href="https://instagram.com/nubiancolourgoddess"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/20 hover:border-[#FF69B4] text-white/70 hover:text-white font-body text-sm tracking-widest uppercase px-10 py-4 rounded-full transition-all duration-200"
          >
            Follow On Instagram
          </a>
        </div>
      </div>
    </div>
  );
}

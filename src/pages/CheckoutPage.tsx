import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { SHIPPING_RATES, PROMO_CODES } from '@/constants/collections';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { createClient } from '@supabase/supabase-js';
import { FunctionsHttpError } from '@supabase/supabase-js';

// Lazy factory — never crashes at module load when env vars are absent.
// Only called at runtime when the customer actually submits the form.
function getSupabase() {
  const url = import.meta.env.VITE_SUPABASE_URL ?? '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
  if (!url || !key) return null;
  return createClient(url, key);
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal } = useCart();
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'US',
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const shippingRate = SHIPPING_RATES.find(r => r.code === form.country) ?? SHIPPING_RATES[0];
  const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const total = subtotal - discount + shippingRate.rate;

  function applyPromo() {
    const upper = promoInput.trim().toUpperCase();
    const promo = PROMO_CODES[upper];
    if (promo) {
      setAppliedPromo({ code: upper, ...promo });
      setPromoError('');
      toast.success(`🎉 ${upper} applied — ${promo.label}!`);
    } else {
      setPromoError('Invalid promo code. Try TWISTED15!');
      setAppliedPromo(null);
    }
  }

  function updateForm(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate required fields
    const required: (keyof FormData)[] = ['firstName', 'lastName', 'email', 'address', 'city', 'country'];
    const missing = required.filter(f => !form[f].trim());
    if (missing.length > 0) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    console.log('Creating Stripe checkout session…', { items, total });

    const supabase = getSupabase();
    if (!supabase) {
      toast.error('Checkout is not configured. Please contact twistedbyngdivine@gmail.com to place your order.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.functions.invoke('create-payment', {
      body: {
        items: items.map(item => ({
          collectionName: item.collectionName,
          colorStory: item.colorStory,
          twist: item.twist,
          quantity: item.quantity,
        })),
        customerEmail: form.email,
        shipping: {
          country: shippingRate.code,
          countryName: shippingRate.country,
          rate: shippingRate.rate,
          days: shippingRate.days,
        },
        promoCode: appliedPromo?.code,
        promoDiscount: appliedPromo?.discount,
      },
    });

    if (error) {
      let errorMessage = error.message;
      if (error instanceof FunctionsHttpError) {
        try {
          const statusCode = error.context?.status ?? 500;
          const textContent = await error.context?.text();
          errorMessage = `[Code: ${statusCode}] ${textContent || error.message}`;
        } catch {
          errorMessage = error.message || 'Failed to read response';
        }
      }
      console.error('Stripe checkout error:', errorMessage);
      toast.error('Payment setup failed. Please try again.');
      setLoading(false);
      return;
    }

    if (data?.url) {
      console.log('Redirecting to Stripe Checkout:', data.url);
      // Escape any iframe (Live Preview) and navigate the top-level browsing context.
      // Stripe refuses to load inside an iframe, so window.location.href hangs when
      // the app is embedded. window.top breaks out; window.open is the fallback.
      try {
        if (window.top && window.top !== window) {
          window.top.location.href = data.url;
        } else {
          window.location.href = data.url;
        }
      } catch {
        // Cross-origin iframe restriction — open in a new tab as fallback
        window.open(data.url, '_blank', 'noopener');
        setLoading(false);
      }
      // Don't reset loading — the page is navigating away
    } else {
      toast.error('Unexpected response from payment service.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D00]">
      <AnnouncementBar />

      {/* Header */}
      <div className="bg-[#111100] border-b border-white/10 px-4 sm:px-6 py-5 flex items-center justify-between">
        <Link to="/cart" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} /> Back to Cart
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-[#FF1493] flex items-center justify-center">
            <span className="font-editorial italic text-[#FF1493] text-xs font-bold">NG</span>
          </div>
          <span className="font-display text-white text-lg tracking-wider">TWISTED</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/40 text-xs">
          <Lock size={12} /> Secure Checkout
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-10">
            {/* Contact */}
            <section>
              <h2 className="font-display text-white text-2xl tracking-tight mb-6">CONTACT</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="First Name *" value={form.firstName} onChange={v => updateForm('firstName', v)} required />
                <InputField label="Last Name *" value={form.lastName} onChange={v => updateForm('lastName', v)} required />
                <div className="sm:col-span-2">
                  <InputField label="Email Address *" type="email" value={form.email} onChange={v => updateForm('email', v)} required />
                </div>
                <div className="sm:col-span-2">
                  <InputField label="Phone (optional)" type="tel" value={form.phone} onChange={v => updateForm('phone', v)} />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="font-display text-white text-2xl tracking-tight mb-6">SHIPPING ADDRESS</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <InputField label="Street Address *" value={form.address} onChange={v => updateForm('address', v)} required />
                </div>
                <InputField label="City *" value={form.city} onChange={v => updateForm('city', v)} required />
                <InputField label="State / Province" value={form.state} onChange={v => updateForm('state', v)} />
                <InputField label="ZIP / Postal Code" value={form.zip} onChange={v => updateForm('zip', v)} />
                <div>
                  <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">Country *</label>
                  <select
                    value={form.country}
                    onChange={e => updateForm('country', e.target.value)}
                    required
                    className="w-full bg-[#111100] border border-white/15 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#FF1493] transition-colors appearance-none"
                  >
                    {SHIPPING_RATES.map(r => (
                      <option key={r.code} value={r.code}>{r.country}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Shipping rate info */}
              <div className="mt-4 bg-[#111100] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs">Standard Shipping to {shippingRate.country}</p>
                  <p className="text-white/30 text-xs mt-0.5">{shippingRate.days}</p>
                </div>
                <span className="text-[#AAFF00] font-display text-xl">${shippingRate.rate.toFixed(2)}</span>
              </div>
            </section>

            {/* Payment section — Stripe Checkout */}
            <section>
              <h2 className="font-display text-white text-2xl tracking-tight mb-2">PAYMENT</h2>
              <p className="text-white/30 text-xs font-editorial italic mb-6">Secure payment powered by Stripe</p>

              <div className="bg-[#111100] border border-[#FF1493]/20 rounded-2xl p-6">
                {/* Stripe badge */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF1493]/20 to-[#BF00FF]/20 border border-[#FF1493]/30 flex items-center justify-center">
                    <Lock size={16} className="text-[#FF1493]" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Secure Checkout via Stripe</p>
                    <p className="text-white/40 text-xs">You'll be redirected to Stripe's encrypted payment page</p>
                  </div>
                </div>

                {/* What you'll see */}
                <div className="space-y-2 mb-5">
                  {[
                    'Credit & Debit Cards (Visa, Mastercard, Amex)',
                    'Apple Pay & Google Pay',
                    '256-bit SSL encryption',
                    'PCI-DSS compliant payment processing',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <Check size={12} className="text-[#AAFF00] shrink-0" />
                      <span className="text-white/50 text-xs">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-white/30 text-xs text-center">
                    Clicking <span className="text-[#FF1493] font-semibold">Complete Order</span> will open Stripe's secure checkout where you'll enter your card details.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-[#111100] border border-white/10 rounded-2xl p-6 sticky top-8">
              <h3 className="font-display text-white text-xl tracking-tight mb-6">ORDER SUMMARY</h3>

              {/* Items */}
              <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#FF1493]/20 to-[#BF00FF]/20 border border-white/10 flex items-center justify-center shrink-0">
                      <span className="text-[#FF1493] text-sm">✦</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{item.collectionName}</p>
                      <p className="text-white/40 text-[10px] truncate">{item.colorStory} · {item.twist.name}</p>
                      <p className="text-white/30 text-[10px]">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-white/70 text-sm shrink-0">${(item.twist.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Promo code */}
              <div className="mb-6">
                <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">Promo Code</label>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-[#AAFF00]/10 border border-[#AAFF00]/30 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-[#AAFF00]" />
                      <span className="text-[#AAFF00] text-sm font-bold">{appliedPromo.code}</span>
                      <span className="text-[#AAFF00]/70 text-xs">— {appliedPromo.label}</span>
                    </div>
                    <button type="button" onClick={() => setAppliedPromo(null)} className="text-white/30 hover:text-white text-xs transition-colors">✕</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoError(''); }}
                      placeholder="Enter code"
                      className="flex-1 bg-[#0D0D00] border border-white/15 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FF1493] transition-colors uppercase tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={applyPromo}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-medium tracking-wider uppercase transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoError && <p className="text-[#FF6B6B] text-xs mt-2">{promoError}</p>}
              </div>

              {/* Confidence Card */}
              <div className="flex items-center gap-2 bg-[#AAFF00]/10 border border-[#AAFF00]/20 rounded-lg px-3 py-2.5 mb-6">
                <span className="text-[#AAFF00] text-sm">✦</span>
                <p className="text-[#AAFF00] text-xs">Confidence Card Included With Every Order</p>
              </div>

              {/* Totals */}
              <div className="space-y-2 pb-4 border-b border-white/10 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#AAFF00]">Discount ({appliedPromo.code})</span>
                    <span className="text-[#AAFF00]">−${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Shipping</span>
                  <span className="text-white">${shippingRate.rate.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-white font-semibold">Estimated Total</span>
                <span className="text-[#AAFF00] font-display text-3xl">${total.toFixed(2)}</span>
              </div>

              <p className="text-white/25 text-[10px] text-center mb-4">
                Final total (including any applied discount) is calculated at Stripe checkout.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF1493] hover:bg-[#e0127f] disabled:opacity-60 text-white font-body font-bold text-sm tracking-widest uppercase py-4 rounded-full transition-all duration-200 hover:shadow-xl hover:shadow-[#FF1493]/30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Preparing Checkout…
                  </>
                ) : (
                  <><ExternalLink size={14} /> Complete Order via Stripe</>
                )}
              </button>

              <p className="text-white/20 text-[10px] text-center mt-3">
                You will be securely redirected to Stripe to enter payment details.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function InputField({
  label, value, onChange, type = 'text', required = false,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="w-full bg-[#111100] border border-white/15 text-white placeholder-white/20 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#FF1493] transition-colors"
      />
    </div>
  );
}

import { useState } from 'react';
import { Search, Package, Sparkles, Heart, ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusStage = 'idle' | 'loading' | 'found' | 'not-found';

interface OrderResult {
  ref: string;
  stage: 'handmade' | 'quality-check' | 'packaged' | 'shipped';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ORDER_STAGES = [
  {
    key: 'handmade',
    label: 'Being Handmade',
    icon: '🧵',
    description: 'Your earrings are currently being hand-braided with care.',
  },
  {
    key: 'quality-check',
    label: 'Quality Check',
    icon: '✦',
    description: 'Each strand is inspected to ensure your pair is one-of-a-kind perfection.',
  },
  {
    key: 'packaged',
    label: 'Packaged With Love',
    icon: '🎀',
    description: 'Your Confidence Card has been selected and your order is beautifully wrapped.',
  },
  {
    key: 'shipped',
    label: 'On Its Way',
    icon: '✈️',
    description: 'Your twist is on its way to you. Get ready to wear the unexpected.',
  },
] as const;

// Deterministic "stage" based on order ref characters — purely decorative
function deriveStage(ref: string): OrderResult['stage'] {
  const clean = ref.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const code = clean.charCodeAt(clean.length - 1) % 4;
  const stages: OrderResult['stage'][] = ['handmade', 'quality-check', 'packaged', 'shipped'];
  return stages[code];
}

const ORDER_REF_REGEX = /^TNG-[A-Z0-9]{8}$/i;

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrderStatusPage() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<StatusStage>('idle');
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [error, setError] = useState('');

  function handleCheck() {
    const trimmed = input.trim().toUpperCase();
    setError('');

    if (!trimmed) {
      setError('Please enter your order reference.');
      return;
    }
    if (!ORDER_REF_REGEX.test(trimmed)) {
      setError('Order references look like TNG-XXXXXXXX. Please double-check yours.');
      return;
    }

    setStatus('loading');
    // Simulate async lookup
    setTimeout(() => {
      setOrder({ ref: trimmed, stage: deriveStage(trimmed) });
      setStatus('found');
    }, 900);
  }

  function handleReset() {
    setInput('');
    setStatus('idle');
    setOrder(null);
    setError('');
  }

  const currentStageIdx = ORDER_STAGES.findIndex(s => s.key === order?.stage);

  return (
    <div className="min-h-screen bg-[#0D0D00] py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background candy accents */}
      <span className="absolute top-16 left-6 text-[#FF1493]/20 text-3xl pointer-events-none select-none animate-sparkle">✦</span>
      <span className="absolute top-32 right-8 text-[#AAFF00]/20 text-2xl pointer-events-none select-none animate-sparkle" style={{ animationDelay: '0.7s' }}>♡</span>
      <span className="absolute bottom-24 left-10 text-[#BF00FF]/20 text-2xl pointer-events-none select-none animate-sparkle" style={{ animationDelay: '1.3s' }}>✧</span>
      <span className="absolute bottom-40 right-12 text-[#FF69B4]/20 text-xl pointer-events-none select-none animate-sparkle" style={{ animationDelay: '0.4s' }}>✦</span>

      {/* Top stripe */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#FF1493] via-[#BF00FF] to-[#AAFF00]" />

      <div className="max-w-xl mx-auto relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <p className="text-[#FF69B4] tracking-[0.3em] uppercase text-xs font-medium mb-3">
            ✦ Order Tracking ✦
          </p>
          <h1 className="font-display text-white text-[clamp(2.2rem,6vw,4rem)] tracking-tight leading-none mb-4">
            TRACK YOUR<br />
            <span className="text-[#FF1493]">TWIST</span>
          </h1>
          <p className="text-white/45 font-body text-sm leading-relaxed max-w-sm mx-auto">
            Enter the order reference from your confirmation email to see where your handmade earrings are.
          </p>
        </div>

        {/* ── Search card ── */}
        <div className="relative mb-8">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#FF1493]/30 via-[#BF00FF]/15 to-[#AAFF00]/20 blur-sm" />
          <div className="relative bg-[#111100] border border-white/10 rounded-2xl p-6 sm:p-8">

            {status !== 'found' ? (
              <>
                <label className="block text-white/50 text-xs tracking-widest uppercase font-medium mb-3">
                  Order Reference
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={input}
                      onChange={e => {
                        setInput(e.target.value.toUpperCase());
                        setError('');
                        if (status === 'not-found') setStatus('idle');
                      }}
                      onKeyDown={e => e.key === 'Enter' && handleCheck()}
                      placeholder="TNG-XXXXXXXX"
                      maxLength={12}
                      className={`w-full bg-[#0D0D00] border rounded-xl px-4 py-3.5 text-white font-body text-sm placeholder:text-white/20 focus:outline-none transition-colors ${
                        error
                          ? 'border-red-500/60 focus:border-red-400'
                          : 'border-white/15 focus:border-[#FF1493]/60'
                      }`}
                    />
                  </div>
                  <button
                    onClick={handleCheck}
                    disabled={status === 'loading'}
                    className="bg-[#FF1493] hover:bg-[#e0127f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-body font-bold text-sm tracking-widest uppercase px-5 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#FF1493]/30 flex items-center gap-2 shrink-0"
                  >
                    {status === 'loading' ? (
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Search size={16} />
                    )}
                    <span className="hidden sm:inline">Check</span>
                  </button>
                </div>

                {error && (
                  <p className="text-red-400 text-xs mt-2.5 flex items-center gap-1.5">
                    <span>⚠</span> {error}
                  </p>
                )}

                <p className="text-white/25 text-xs mt-4 font-editorial italic">
                  Your reference was emailed to you after purchase. It starts with TNG-
                </p>
              </>
            ) : (
              /* Reset button when result is showing */
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-white/40 hover:text-white/70 text-xs transition-colors"
              >
                <RotateCcw size={12} />
                Track a different order
              </button>
            )}
          </div>
        </div>

        {/* ── Result: Found ── */}
        {status === 'found' && order && (
          <div className="space-y-4 animate-fade-up">

            {/* Order ref banner */}
            <div className="bg-[#111100] border border-[#FF1493]/30 rounded-2xl px-6 py-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[#FF69B4] text-[10px] tracking-widest uppercase font-medium mb-0.5">Order Reference</p>
                <p className="text-white font-display text-2xl tracking-wider">{order.ref}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#FF1493]/15 border border-[#FF1493]/30 flex items-center justify-center shrink-0">
                <Package size={20} className="text-[#FF1493]" />
              </div>
            </div>

            {/* Handmade hero message */}
            <div className="bg-gradient-to-br from-[#FF1493]/10 to-[#BF00FF]/10 border border-white/10 rounded-2xl px-6 py-6 text-center">
              <p className="text-3xl mb-3">🧵</p>
              <h2 className="font-display text-white text-2xl tracking-tight mb-2">
                YOUR ORDER IS BEING{' '}
                <span className="text-[#FF1493]">HANDMADE</span>
              </h2>
              <p className="text-white/55 font-body text-sm leading-relaxed">
                Every pair is braided by hand, one at a time. We take our time because your confidence deserves it.
              </p>
            </div>

            {/* Stage tracker */}
            <div className="bg-[#111100] border border-white/10 rounded-2xl px-6 py-6">
              <p className="text-white/40 text-[10px] tracking-widest uppercase font-medium mb-6">Order Progress</p>
              <div className="space-y-1">
                {ORDER_STAGES.map((stage, idx) => {
                  const isComplete = idx < currentStageIdx;
                  const isCurrent = idx === currentStageIdx;
                  const isPending = idx > currentStageIdx;
                  return (
                    <div key={stage.key}>
                      <div className="flex items-start gap-4 py-3">
                        {/* Icon dot */}
                        <div
                          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 text-sm transition-all duration-300 ${
                            isComplete
                              ? 'border-[#AAFF00] bg-[#AAFF00]/15 text-[#AAFF00]'
                              : isCurrent
                              ? 'border-[#FF1493] bg-[#FF1493]/15 text-base'
                              : 'border-white/10 bg-transparent text-white/20'
                          }`}
                        >
                          {isComplete ? '✓' : stage.icon}
                        </div>
                        {/* Text */}
                        <div className="flex-1 min-w-0 pt-1">
                          <p
                            className={`font-semibold text-sm transition-colors ${
                              isComplete
                                ? 'text-[#AAFF00]'
                                : isCurrent
                                ? 'text-white'
                                : 'text-white/25'
                            }`}
                          >
                            {stage.label}
                            {isCurrent && (
                              <span className="ml-2 text-[#FF1493] text-[10px] tracking-widest uppercase font-normal align-middle">
                                ← Current
                              </span>
                            )}
                          </p>
                          {isCurrent && (
                            <p className="text-white/45 text-xs mt-0.5 leading-snug">{stage.description}</p>
                          )}
                        </div>
                      </div>
                      {/* Connector line */}
                      {idx < ORDER_STAGES.length - 1 && (
                        <div
                          className={`ml-[18px] w-0.5 h-3 ${
                            idx < currentStageIdx ? 'bg-[#AAFF00]/40' : 'bg-white/8'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Confidence card callout */}
            <div className="flex items-center gap-3 bg-[#AAFF00]/8 border border-[#AAFF00]/20 rounded-xl px-5 py-4">
              <Sparkles size={16} className="text-[#AAFF00] shrink-0" />
              <p className="text-[#AAFF00] text-xs leading-snug">
                A <span className="font-semibold">Collectible Confidence Card</span> has been randomly selected and will ship with your order.
              </p>
            </div>

            {/* Support note */}
            <div className="text-center pt-2">
              <p className="text-white/30 text-xs font-editorial italic mb-3">
                Questions about your order?
              </p>
              <a
                href="mailto:twistedbyngdivine@gmail.com"
                className="inline-flex items-center gap-2 text-[#FF69B4] hover:text-[#FF1493] text-xs font-medium transition-colors"
              >
                <Heart size={12} />
                twistedbyngdivine@gmail.com
              </a>
            </div>
          </div>
        )}

        {/* ── FAQ note ── */}
        {status !== 'found' && (
          <div className="mt-10 text-center">
            <p className="text-white/25 text-xs mb-3">Need help finding your reference?</p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="mailto:twistedbyngdivine@gmail.com"
                className="text-[#FF69B4] hover:text-[#FF1493] text-xs transition-colors font-medium"
              >
                Email Us
              </a>
              <span className="text-white/15">·</span>
              <Link
                to="/#faq"
                className="text-[#FF69B4] hover:text-[#FF1493] text-xs transition-colors font-medium"
              >
                View FAQ
              </Link>
              <span className="text-white/15">·</span>
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-[#FF69B4] hover:text-[#FF1493] text-xs transition-colors font-medium"
              >
                Shop <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom stripe */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[#AAFF00] via-[#BF00FF] to-[#FF1493]" />
    </div>
  );
}

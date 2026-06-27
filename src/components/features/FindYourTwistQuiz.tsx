import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Quiz data ───────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 1,
    question: "What's your vibe?",
    options: [
      { label: '🍬 Bold & Dramatic',        points: { wined: 3, taffy: 0, twizzlers: 0 } },
      { label: '🌸 Soft & Effortless',       points: { wined: 0, taffy: 3, twizzlers: 0 } },
      { label: '🎉 Loud & Unbothered',       points: { wined: 0, taffy: 0, twizzlers: 3 } },
      { label: '✨ Mysterious & Confident',  points: { wined: 2, taffy: 1, twizzlers: 1 } },
    ],
  },
  {
    id: 2,
    question: 'Which weekend sounds most like you?',
    options: [
      { label: '🍭 Candy night with the girls',        points: { wined: 3, taffy: 0, twizzlers: 0 } },
      { label: '🌊 Beach day, soft waves & sunsets',  points: { wined: 0, taffy: 3, twizzlers: 0 } },
      { label: '🎡 Festival, neon lights, dancing',   points: { wined: 0, taffy: 0, twizzlers: 3 } },
      { label: '🛍️ Solo shopping trip, main character energy', points: { wined: 1, taffy: 1, twizzlers: 2 } },
    ],
  },
  {
    id: 3,
    question: 'Pick a candy color combination.',
    options: [
      { label: '❤️ Deep Red + Golden Yellow',   points: { wined: 3, taffy: 0, twizzlers: 0 } },
      { label: '🍋 Soft Lemon + Creamy Vanilla', points: { wined: 0, taffy: 3, twizzlers: 0 } },
      { label: '💜 Electric Grape + Hot Pink',   points: { wined: 0, taffy: 0, twizzlers: 3 } },
      { label: '💚 Lime Green + Candy Pink',     points: { wined: 1, taffy: 2, twizzlers: 1 } },
    ],
  },
  {
    id: 4,
    question: "What's your signature energy?",
    options: [
      { label: '🔥 The one who commands the room',  points: { wined: 3, taffy: 0, twizzlers: 0 } },
      { label: '🌙 The one who makes it look easy', points: { wined: 0, taffy: 3, twizzlers: 0 } },
      { label: '⚡ The one who starts the party',    points: { wined: 0, taffy: 0, twizzlers: 3 } },
      { label: '💫 The one everyone remembers',      points: { wined: 1, taffy: 1, twizzlers: 2 } },
    ],
  },
  {
    id: 5,
    question: 'How do you want people to remember you?',
    options: [
      { label: '👑 Unforgettable. Period.',              points: { wined: 3, taffy: 0, twizzlers: 0 } },
      { label: '🤍 Graceful, soft, and so put-together', points: { wined: 0, taffy: 3, twizzlers: 0 } },
      { label: '🎊 Fun, fearless, and full of life',     points: { wined: 0, taffy: 0, twizzlers: 3 } },
      { label: '💋 Like no one else in the room',         points: { wined: 1, taffy: 1, twizzlers: 2 } },
    ],
  },
];

type Collection = 'wined' | 'taffy' | 'twizzlers';

const RESULTS: Record<Collection, {
  slug: string;
  emoji: string;
  name: string;
  tagline: string;
  quote: string;
  accentColor: string;
  glowColor: string;
}> = {
  wined: {
    slug: 'wined-candy',
    emoji: '🍬',
    name: 'Wined Candy',
    tagline: 'Bold. Juicy. Unforgettable.',
    quote: "Beautiful... your twist is Wined Candy.\n\nBold. Juicy. Unforgettable.\n\nYou don't follow the crowd—you create the moment. Your confidence is sweet, unforgettable, and impossible to ignore.",
    accentColor: '#C41E3A',
    glowColor: '#C41E3A55',
  },
  taffy: {
    slug: 'salt-water-taffy',
    emoji: '🍋',
    name: 'Salt Water Taffy',
    tagline: 'Sweet. Soft. Sophisticated.',
    quote: "Girl... your twist is Salt Water Taffy. Sweet. Soft. Sophisticated. Quiet confidence always makes the loudest statement.",
    accentColor: '#FF9FCF',
    glowColor: '#FF9FCF55',
  },
  twizzlers: {
    slug: 'twizzlers',
    emoji: '🍭',
    name: 'Twizzlers',
    tagline: 'Loud. Playful. Unapologetic.',
    quote: "Girl... your twist is Twizzlers. Loud. Playful. Unapologetic. You were born to stand out and have fun doing it.",
    accentColor: '#BF00FF',
    glowColor: '#BF00FF55',
  },
};

// ─── Decorative candy bits ────────────────────────────────────────────────────

const CONFETTI = [
  { top: '8%',  left: '4%',  symbol: '✦', color: '#FF1493', size: '18px', delay: '0s'   },
  { top: '12%', right: '6%', symbol: '♡', color: '#AAFF00', size: '14px', delay: '0.5s' },
  { top: '25%', left: '2%',  symbol: '✧', color: '#FF69B4', size: '12px', delay: '1s'   },
  { top: '40%', right: '3%', symbol: '✦', color: '#BF00FF', size: '16px', delay: '0.3s' },
  { top: '60%', left: '5%',  symbol: '♡', color: '#FF1493', size: '10px', delay: '0.8s' },
  { top: '75%', right: '5%', symbol: '✧', color: '#AAFF00', size: '14px', delay: '1.2s' },
  { top: '88%', left: '3%',  symbol: '✦', color: '#FF69B4', size: '12px', delay: '0.6s' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function FindYourTwistQuiz() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<Collection, number>>({ wined: 0, taffy: 0, twizzlers: 0 });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<Collection | null>(null);
  const [animatingNext, setAnimatingNext] = useState(false);

  const progress = ((currentQ) / QUESTIONS.length) * 100;
  const question = QUESTIONS[currentQ];

  function handleSelect(optionIdx: number) {
    if (animatingNext) return;
    setSelectedOption(optionIdx);

    const pts = question.options[optionIdx].points;
    const next: Record<Collection, number> = {
      wined:     scores.wined     + pts.wined,
      taffy:     scores.taffy     + pts.taffy,
      twizzlers: scores.twizzlers + pts.twizzlers,
    };

    setAnimatingNext(true);
    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setScores(next);
        setCurrentQ(q => q + 1);
        setSelectedOption(null);
        setAnimatingNext(false);
      } else {
        // Calculate winner
        const winner = (Object.entries(next) as [Collection, number][])
          .reduce((a, b) => (b[1] > a[1] ? b : a))[0];
        setScores(next);
        setResult(winner);
        setAnimatingNext(false);
      }
    }, 380);
  }

  function handleRestart() {
    setCurrentQ(0);
    setScores({ wined: 0, taffy: 0, twizzlers: 0 });
    setSelectedOption(null);
    setResult(null);
    setAnimatingNext(false);
  }

  function handleShopTwist(slug: string) {
    navigate(`/collections/${slug}`);
  }

  return (
    <section
      id="find-your-twist"
      className="relative bg-[#0D0D00] py-24 px-4 sm:px-6 overflow-hidden"
    >
      {/* Decorative confetti */}
      {CONFETTI.map((c, i) => (
        <span
          key={i}
          className="absolute pointer-events-none animate-sparkle select-none"
          style={{
            top: c.top,
            left: (c as any).left,
            right: (c as any).right,
            color: c.color,
            fontSize: c.size,
            animationDelay: c.delay,
            opacity: 0.55,
          }}
        >
          {c.symbol}
        </span>
      ))}

      {/* Top candy-stripe divider */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#FF1493] via-[#BF00FF] to-[#AAFF00]" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-[#FF69B4] tracking-[0.3em] uppercase text-xs font-medium mb-3">
            ✨ FIND YOUR TWIST ✨
          </p>
          <h2 className="font-display text-white text-[clamp(2rem,5.5vw,4rem)] tracking-tight leading-none mb-4">
            WHICH TWIST MATCHES<br />
            <span className="text-[#FF1493]">YOUR PERSONALITY?</span>
          </h2>
          <p className="text-white/50 font-body text-base leading-relaxed max-w-md mx-auto">
            Answer a few fun questions and discover the Twisted by NG Divine collection that fits your vibe.
          </p>
        </div>

        {/* Quiz card */}
        <div className="relative">
          {/* Glow ring */}
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-[#FF1493]/40 via-[#BF00FF]/20 to-[#AAFF00]/30 blur-sm" />

          <div className="relative bg-[#111100] border border-white/10 rounded-3xl overflow-hidden">

            {/* ── RESULT STATE ── */}
            {result ? (
              <ResultCard
                result={RESULTS[result]}
                onRestart={handleRestart}
                onShop={handleShopTwist}
              />
            ) : (
              <>
                {/* Progress bar */}
                <div className="h-1 bg-[#1a1a00]">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF1493] via-[#BF00FF] to-[#AAFF00] transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Question header */}
                <div className="px-6 sm:px-10 pt-8 pb-2 flex items-center justify-between">
                  <span className="text-white/30 text-xs tracking-widest uppercase">
                    Question {currentQ + 1} of {QUESTIONS.length}
                  </span>
                  <div className="flex gap-1">
                    {QUESTIONS.map((_, i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          i < currentQ
                            ? 'bg-[#FF1493]'
                            : i === currentQ
                            ? 'bg-[#FF69B4] scale-125'
                            : 'bg-white/15'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Question text */}
                <div className="px-6 sm:px-10 py-6">
                  <h3 className="font-display text-white text-[clamp(1.4rem,4vw,2rem)] tracking-tight mb-8 leading-snug">
                    {question.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3">
                    {question.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelect(idx)}
                          disabled={animatingNext}
                          className={`w-full text-left px-5 py-4 rounded-xl border font-body text-sm leading-snug transition-all duration-200 group
                            ${isSelected
                              ? 'bg-[#FF1493]/15 border-[#FF1493] text-white scale-[1.01] shadow-lg shadow-[#FF1493]/20'
                              : 'bg-transparent border-white/10 text-white/70 hover:border-[#FF69B4]/50 hover:text-white hover:bg-white/5 hover:scale-[1.005]'
                            }
                            disabled:cursor-default
                          `}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-200 ${
                                isSelected ? 'border-[#FF1493] bg-[#FF1493]' : 'border-white/25 group-hover:border-[#FF69B4]'
                              }`}
                            >
                              {isSelected && <span className="text-white text-[10px]">✦</span>}
                            </span>
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer note */}
                <div className="px-6 sm:px-10 pb-8 text-center">
                  <p className="text-white/20 text-xs font-editorial italic">
                    Tap any answer to continue ♡
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom candy dots */}
        <div className="flex justify-center gap-3 mt-8">
          {['#FF1493', '#BF00FF', '#AAFF00', '#FF69B4', '#FF1493'].map((c, i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: c, opacity: 0.4 + i * 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* Bottom candy-stripe divider */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[#AAFF00] via-[#BF00FF] to-[#FF1493]" />
    </section>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({
  result,
  onRestart,
  onShop,
}: {
  result: typeof RESULTS[Collection];
  onRestart: () => void;
  onShop: (slug: string) => void;
}) {
  return (
    <div className="px-6 sm:px-10 py-12 text-center">
      {/* Emoji burst */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-2xl"
        style={{
          background: `radial-gradient(circle at 40% 35%, ${result.accentColor}44, ${result.accentColor}22)`,
          border: `2px solid ${result.accentColor}66`,
          boxShadow: `0 0 40px ${result.glowColor}`,
        }}
      >
        {result.emoji}
      </div>

      {/* "You got..." label */}
      <p
        className="text-xs tracking-[0.3em] uppercase font-medium mb-3"
        style={{ color: result.accentColor }}
      >
        ✨ BEAUTIFUL... YOUR TWIST IS ✨
      </p>

      {/* Collection name */}
      <h3 className="font-display text-white text-[clamp(2rem,6vw,3.5rem)] tracking-tight leading-none mb-2">
        {result.name.toUpperCase()}
      </h3>
      <p className="font-editorial italic mb-8 text-lg" style={{ color: result.accentColor }}>
        {result.tagline}
      </p>

      {/* Quote */}
      <div
        className="rounded-2xl px-6 py-5 mb-8 border"
        style={{
          background: `${result.accentColor}12`,
          borderColor: `${result.accentColor}30`,
        }}
      >
        <p className="text-white/80 font-body text-base leading-relaxed font-medium whitespace-pre-line">
          "{result.quote}"
        </p>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => onShop(result.slug)}
          className="font-body font-bold text-sm tracking-widest uppercase px-10 py-4 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-xl text-white"
          style={{
            background: result.accentColor,
            boxShadow: `0 0 0 0 ${result.glowColor}`,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 12px 30px ${result.glowColor}`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 0 0 ${result.glowColor}`;
          }}
        >
          Shop {result.name} →
        </button>
        <button
          onClick={onRestart}
          className="border border-white/20 hover:border-white/40 text-white/60 hover:text-white font-body text-sm tracking-widest uppercase px-8 py-4 rounded-full transition-all duration-200"
        >
          Retake Quiz ↺
        </button>
      </div>

      {/* Sparkle footer */}
      <p className="text-white/20 text-xs font-editorial italic mt-6">
        No two twists are exactly alike. Just like you. ✦
      </p>
    </div>
  );
}

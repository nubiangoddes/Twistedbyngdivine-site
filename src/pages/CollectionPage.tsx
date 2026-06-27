import { useState, useMemo, useId } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { COLLECTIONS, TWIST_OPTIONS, COLOR_SWATCHES } from '@/constants/collections';
import { useCart } from '@/contexts/CartContext';

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const collection = useMemo(() => COLLECTIONS.find(c => c.slug === slug), [slug]);

  const [selectedColor, setSelectedColor] = useState(collection?.colorStories[0]?.id ?? '');
  const [selectedTwistId, setSelectedTwistId] = useState(TWIST_OPTIONS[0].id);
  const [quantity, setQuantity] = useState(1);

  if (!collection) {
    return (
      <div className="min-h-screen bg-[#0D0D00] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl font-display mb-4">Collection not found.</p>
          <Link to="/" className="text-[#FF1493] hover:text-[#FF69B4] text-sm">← Back to home</Link>
        </div>
      </div>
    );
  }

  const selectedTwist = TWIST_OPTIONS.find(t => t.id === selectedTwistId)!;
  const total = (selectedTwist.price * quantity).toFixed(2);

  function handleAddToCart() {
    const colorName = collection!.colorStories.find(c => c.id === selectedColor)?.name ?? selectedColor;
    addItem({
      collectionSlug: collection!.slug,
      collectionName: collection!.name,
      collectionNumber: collection!.number,
      colorStory: colorName,
      twist: selectedTwist,
      quantity,
    });
    toast.success(`${collection!.name} — ${selectedTwist.name} added to cart! ✦`);
  }

  return (
    <div className="min-h-screen bg-[#0D0D00]">
      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img src={collection.image} alt={collection.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#0D0D00]" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <p className="font-editorial italic text-[#FF69B4] text-sm mb-2">{collection.number}</p>
          <h1 className="font-display text-white text-[clamp(2.5rem,6vw,5rem)] tracking-tight">{collection.name}</h1>
          <p className="font-editorial italic text-[#FF69B4] text-lg mt-2">{collection.tagline}</p>
        </div>
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      {/* Product Section */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Image */}
          <div className="relative">
            <div className="sticky top-24 rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img src={collection.image} alt={collection.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30" />
              <div className="absolute top-4 left-4 bg-[#FF1493] text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                Handmade
              </div>
              <div className="absolute bottom-4 right-4 bg-[#0D0D00]/80 border border-white/20 rounded-xl px-4 py-3">
                <p className="text-white/50 text-[10px] tracking-widest uppercase">Starting at</p>
                <p className="text-[#AAFF00] font-display text-2xl">$15</p>
              </div>
            </div>
          </div>

          {/* Right: Product Options */}
          <div>
            <div className="mb-8">
              <p className="font-editorial italic text-[#FF69B4] text-sm mb-1">{collection.number}</p>
              <h2 className="font-display text-white text-4xl tracking-tight mb-3">{collection.name}</h2>
              <p className="text-white/60 font-body text-base leading-relaxed">{collection.description}</p>
            </div>

            {/* Confidence Card note */}
            <div className="flex items-center gap-3 bg-[#AAFF00]/10 border border-[#AAFF00]/30 rounded-xl px-4 py-3 mb-8">
              <span className="text-[#AAFF00] text-lg">✦</span>
              <p className="text-[#AAFF00] text-xs font-medium">Confidence Card included with every order</p>
            </div>

            {/* Color Story Selector */}
            <div className="mb-8">
              <label className="block text-white/60 text-xs tracking-widest uppercase font-medium mb-4">
                Color Story —{' '}
                <span className="text-[#FF69B4] normal-case tracking-normal font-semibold">
                  {collection.colorStories.find(c => c.id === selectedColor)?.name}
                </span>
              </label>
              <div className="flex flex-wrap gap-5">
                {collection.colorStories.map(cs => {
                  const swatch = COLOR_SWATCHES[cs.id];
                  const isActive = selectedColor === cs.id;
                  return (
                    <button
                      key={cs.id}
                      onClick={() => setSelectedColor(cs.id)}
                      title={cs.name}
                      aria-label={cs.name}
                      aria-pressed={isActive}
                      className="group relative flex flex-col items-center gap-2 focus:outline-none"
                    >
                      {/* Braided swatch circle */}
                      <BraidedSwatch
                        primary={swatch?.primary ?? '#FF1493'}
                        secondary={swatch?.secondary ?? '#FF69B4'}
                        isActive={isActive}
                        size={48}
                      />
                      {/* Label below swatch */}
                      <span
                        className={`text-[10px] text-center leading-tight max-w-[64px] transition-colors duration-150 ${
                          isActive ? 'text-[#FF69B4] font-semibold' : 'text-white/40 group-hover:text-white/60'
                        }`}
                      >
                        {cs.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Twist Selector */}
            <div className="mb-8">
              <label className="block text-white/60 text-xs tracking-widest uppercase font-medium mb-3">
                Choose Your Twist
              </label>
              <div className="space-y-3">
                {TWIST_OPTIONS.map(twist => (
                  <button
                    key={twist.id}
                    onClick={() => setSelectedTwistId(twist.id)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-150 ${
                      selectedTwistId === twist.id
                        ? 'bg-[#FF1493]/10 border-[#FF1493] text-white'
                        : 'bg-transparent border-white/15 text-white/60 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selectedTwistId === twist.id ? 'border-[#FF1493]' : 'border-white/30'
                      }`}>
                        {selectedTwistId === twist.id && (
                          <div className="w-2 h-2 rounded-full bg-[#FF1493]" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{twist.name}</p>
                        <p className={`text-xs mt-0.5 ${selectedTwistId === twist.id ? 'text-[#FF69B4]' : 'text-white/30'}`}>
                          {twist.size} hoop
                        </p>
                      </div>
                    </div>
                    <span className={`font-display text-xl ${selectedTwistId === twist.id ? 'text-[#AAFF00]' : 'text-white/40'}`}>
                      ${twist.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-white/60 text-xs tracking-widest uppercase font-medium mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-white/20 rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-3 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-6 py-3 text-white font-semibold text-lg min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-4 py-3 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-white/40 text-sm">
                  Total: <span className="text-[#AAFF00] font-display text-xl">${total}</span>
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="btn-shine w-full bg-[#FF1493] hover:bg-[#e0127f] text-white font-body font-bold text-sm tracking-widest uppercase py-5 rounded-full transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#FF1493]/30 flex items-center justify-center gap-3"
            >
              <ShoppingBag size={18} />
              Add To Cart — ${total}
            </button>

            <p className="text-white/30 text-xs text-center mt-4 font-editorial italic">
              Handmade with care. No two pairs are exactly alike.
            </p>
          </div>
        </div>
      </div>

      {/* Other collections */}
      <div className="border-t border-white/10 bg-[#111100] py-16 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-white/40 text-xs tracking-widest uppercase text-center mb-8">Explore More Collections</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COLLECTIONS.filter(c => c.slug !== slug).map(c => (
              <Link
                key={c.slug}
                to={`/collections/${c.slug}`}
                className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-[#FF1493]/40 transition-all duration-200"
                style={{ aspectRatio: '16/9' }}
              >
                <img src={c.image} alt={c.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-editorial italic text-[#FF69B4] text-xs">{c.number}</p>
                  <p className="font-display text-white text-xl">{c.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BraidedSwatch — renders a miniature braided fabric preview inside a circle
// ---------------------------------------------------------------------------
function BraidedSwatch({
  primary,
  secondary,
  isActive,
  size = 48,
}: {
  primary: string;
  secondary: string;
  isActive: boolean;
  size?: number;
}) {
  const uid = useId().replace(/:/g, '');
  const clipId = `clip-${uid}`;
  const highlightId = `hl-${uid}`;
  const r = size / 2;
  const isSingleColor = primary === secondary;

  // Build diagonal stripe positions for the braid illusion
  const stripeW = size * 0.22;
  const gap = size * 0.06;
  const stripes: { x: number; color: string }[] = [];
  let pos = -size * 1.5;
  let toggle = false;
  while (pos < size * 2) {
    stripes.push({ x: pos, color: toggle ? secondary : primary });
    pos += stripeW + gap;
    toggle = !toggle;
  }

  return (
    <span
      className="flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer"
      style={{
        width: size + 10,
        height: size + 10,
        boxShadow: isActive
          ? `0 0 0 2px #0D0D00, 0 0 0 4px ${primary}, 0 6px 20px ${primary}55`
          : `0 0 0 2px rgba(255,255,255,0.08)`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ borderRadius: '50%', display: 'block' }}
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx={r} cy={r} r={r} />
          </clipPath>
          <radialGradient id={highlightId} cx="38%" cy="28%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.20" />
          </radialGradient>
        </defs>

        {/* Base fill */}
        <circle cx={r} cy={r} r={r} fill={primary} />

        <g clipPath={`url(#${clipId})`}>
          {/* Layer 1: main diagonal braid stripes (bottom-left to top-right) */}
          {stripes.map((s, i) => (
            <rect
              key={`a${i}`}
              x={s.x}
              y={-size}
              width={stripeW}
              height={size * 4}
              fill={s.color}
              opacity={isSingleColor ? 0 : 0.90}
              transform={`rotate(-42 ${r} ${r})`}
            />
          ))}

          {/* Layer 2: cross-hatching in opposite direction for weave depth */}
          {!isSingleColor && stripes.map((s, i) => (
            <rect
              key={`b${i}`}
              x={s.x}
              y={-size}
              width={stripeW * 0.50}
              height={size * 4}
              fill={i % 2 === 0 ? primary : secondary}
              opacity={0.18}
              transform={`rotate(42 ${r} ${r})`}
            />
          ))}

          {/* Radial highlight for fabric depth illusion */}
          <circle cx={r} cy={r} r={r} fill={`url(#${highlightId})`} />
        </g>

        {/* Border ring */}
        <circle
          cx={r}
          cy={r}
          r={r - 1}
          fill="none"
          stroke={isActive ? primary : 'rgba(255,255,255,0.18)'}
          strokeWidth={isActive ? 2.5 : 1}
        />
      </svg>
    </span>
  );
}

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: 'Are these really made from ponytail holders?',
    a: 'Yes! Every pair of Twisted by NG Divine earrings is hand-braided using everyday ponytail holders. What started as a creative experiment became a signature craft — transforming the familiar into something extraordinary.',
  },
  {
    q: 'Are all pairs unique?',
    a: 'Absolutely. Because each pair is handmade, no two twists are exactly alike. Small variations in color, texture, and braid pattern make every pair one-of-one. You\'re not just buying earrings — you\'re buying an original.',
  },
  {
    q: 'What sizes are available?',
    a: 'We offer three Twist sizes: Signature Twist (2") at $20, Bow Twist (3") at $25, and Main Character Twist (4") at $30. Each size creates a different statement — from subtle to show-stopping.',
  },
  {
    q: 'How long does shipping take?',
    a: 'US orders: 3–5 business days. Canada: 7–10 business days. UK: 7–14 business days. Australia: 10–14 business days. All orders are shipped with tracking. Please allow 1–2 business days for order processing.',
  },
  {
    q: 'Do you accept returns?',
    a: 'Because every pair is handmade and one-of-one, we do not accept returns for change of mind. However, if your order arrives damaged or there is an issue, please reach out to us at twistedbyngdivine@gmail.com within 7 days of delivery.',
  },
  {
    q: 'What is a Confidence Card?',
    a: 'A Confidence Card is a randomly selected collectible card included with every Twisted by NG Divine order. Each card features an empowering message and is hand-numbered. The design is a surprise — you won\'t know which card you\'re getting until you open your package.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-[#111100] py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#FF69B4] tracking-[0.3em] uppercase text-xs font-medium mb-3">✦ FAQ ✦</p>
          <h2 className="font-display text-white text-[clamp(2rem,5vw,4rem)] tracking-tight">
            GOT QUESTIONS?
          </h2>
          <p className="text-white/40 font-body text-base mt-3">We've got the twist on everything.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="border border-white/10 rounded-xl overflow-hidden hover:border-[#FF1493]/30 transition-colors"
            >
              <button
                className="w-full flex items-center justify-between gap-4 p-6 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-white font-body font-medium text-sm leading-relaxed">{faq.q}</span>
                <span className="text-[#FF1493] shrink-0">
                  {open === i ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-6">
                  <div className="h-px bg-white/10 mb-5" />
                  <p className="text-white/60 font-body text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

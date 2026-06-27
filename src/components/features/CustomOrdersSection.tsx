export default function CustomOrdersSection() {
  return (
    <section className="bg-blush py-20 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="bg-gradient-to-r from-[#0D0D00] to-[#1a1900] rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Content */}
            <div className="p-12 lg:p-16 flex flex-col justify-center">
              <p className="text-[#AAFF00] tracking-[0.3em] uppercase text-xs font-medium mb-4">✦ Made For You ✦</p>
              <h2 className="font-display text-white text-[clamp(2rem,4vw,3.5rem)] tracking-tight leading-none mb-6">
                CUSTOM<br />
                <span className="text-[#FF1493]">ORDERS</span>
              </h2>
              <p className="text-white/60 font-body text-base leading-relaxed mb-8">
                Want a twist that's entirely yours? Custom orders are available for special events, gifts, or any occasion that calls for something one-of-one. Reach out and let's create your perfect pair.
              </p>
              <div className="space-y-3 mb-10">
                {['Weddings & Bridal Parties', 'Special Events & Birthdays', 'Brand Gifting & Collaborations', 'Matching Sets & Bulk Orders'].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="text-[#FF1493] text-xs">✦</span>
                    <span className="text-white/70 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <a
                href="mailto:twistedbyngdivine@gmail.com?subject=Custom Order Inquiry"
                className="inline-block bg-[#FF1493] hover:bg-[#e0127f] text-white font-body font-semibold text-sm tracking-widest uppercase px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 text-center"
              >
                Request A Custom Order →
              </a>
            </div>

            {/* Visual side */}
            <div className="relative overflow-hidden hidden md:block" style={{ minHeight: '400px' }}>
              <img
                src="https://images.unsplash.com/photo-1617967709022-4c9ddee40028?w=700&fit=crop&q=80"
                alt="Custom Orders"
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="font-display text-white/20 text-[120px] leading-none block">✦</span>
                  <span className="font-editorial italic text-[#FF69B4] text-xl">Your Vision. Our Hands.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

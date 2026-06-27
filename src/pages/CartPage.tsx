import { useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';

import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  function goToCollections() {
    const el = document.getElementById('collections');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' }), 400);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0D0D00] flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag size={64} className="text-white/20 mx-auto mb-6" />
          <h2 className="font-display text-white text-4xl tracking-tight mb-3">YOUR BAG IS EMPTY</h2>
          <p className="text-white/40 font-body text-base mb-10 font-editorial italic">No twists yet — let's fix that.</p>
          <button
            onClick={goToCollections}
            className="inline-block bg-[#FF1493] hover:bg-[#e0127f] text-white font-body font-bold text-sm tracking-widest uppercase px-10 py-4 rounded-full transition-all duration-200"
          >
            Shop Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D00] py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[#FF69B4] tracking-[0.3em] uppercase text-xs font-medium mb-2">✦ Your Selection ✦</p>
          <h1 className="font-display text-white text-[clamp(2.5rem,5vw,4rem)] tracking-tight">YOUR BAG</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-[#111100] border border-white/10 rounded-2xl p-6 flex gap-5">
                {/* Visual */}
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#FF1493]/20 to-[#BF00FF]/20 border border-white/10 flex items-center justify-center shrink-0">
                  <span className="text-[#FF1493] text-2xl">✦</span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="text-[#FF69B4] font-editorial italic text-xs">{item.collectionNumber}</p>
                      <h3 className="text-white font-display text-xl tracking-tight">{item.collectionName}</h3>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-white/30 hover:text-[#FF1493] transition-colors shrink-0 p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-white/50 text-xs mb-1">
                    Color Story: <span className="text-white/70">{item.colorStory}</span>
                  </p>
                  <p className="text-white/50 text-xs mb-4">
                    Twist: <span className="text-white/70">{item.twist.name} ({item.twist.size})</span>
                  </p>

                  {/* Qty + Price row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-white/15 rounded-full overflow-hidden">
                      <button
                        onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                        className="px-3 py-2 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="px-4 text-white text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-2 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-[#AAFF00] font-display text-2xl">${(item.twist.price * item.quantity).toFixed(2)}</p>
                      <p className="text-white/30 text-xs">${item.twist.price} each</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-[#111100] border border-white/10 rounded-2xl p-6 sticky top-24">
              <h3 className="font-display text-white text-xl tracking-tight mb-6">ORDER SUMMARY</h3>

              {/* Lines */}
              <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-white/50 truncate flex-1 mr-3">{item.collectionName} × {item.quantity}</span>
                    <span className="text-white/70 shrink-0">${(item.twist.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Confidence Card */}
              <div className="flex items-center gap-2 bg-[#AAFF00]/10 border border-[#AAFF00]/20 rounded-lg px-3 py-2.5 mb-6">
                <span className="text-[#AAFF00] text-sm">✦</span>
                <p className="text-[#AAFF00] text-xs">Confidence Card included</p>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/50 text-sm">Subtotal</span>
                <span className="text-white font-semibold text-lg">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-white/30 text-xs mb-8 font-editorial italic">Shipping calculated at checkout</p>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#FF1493] hover:bg-[#e0127f] text-white font-body font-bold text-sm tracking-widest uppercase py-4 rounded-full transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#FF1493]/30"
              >
                Proceed To Checkout <ArrowRight size={16} />
              </button>

              <button
                onClick={goToCollections}
                className="block w-full text-center text-white/40 hover:text-white/70 text-xs mt-4 transition-colors"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

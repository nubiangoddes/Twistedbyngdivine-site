// create-payment — Twisted by NG Divine
// Creates a Stripe Checkout Session for one-time earring purchases.
// Supports dynamic line items (collection + color story + twist), promo codes,
// and guest checkout (no auth required).

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { corsHeaders } from "../_shared/cors.ts";

interface CartItem {
  collectionName: string;
  colorStory: string;
  twist: { name: string; size: string; price: number };
  quantity: number;
}

interface PaymentRequest {
  items: CartItem[];
  customerEmail: string;
  shipping: { country: string; countryName: string; rate: number; days: string };
  promoCode?: string;            // e.g. "TWISTED15"
  promoDiscount?: number;        // e.g. 0.15  (fraction)
}

serve(async (req) => {
  // ── CORS preflight ──────────────────────────────────────────────────────────
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2025-08-27.basil",
    });

    const body: PaymentRequest = await req.json();
    const { items, customerEmail, shipping, promoCode, promoDiscount } = body;

    if (!items?.length) {
      throw new Error("Cart is empty.");
    }
    if (!customerEmail) {
      throw new Error("Customer email is required.");
    }

    // ── Build Stripe line_items from cart ───────────────────────────────────
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(item.twist.price * 100), // cents
        product_data: {
          name: `${item.collectionName} — ${item.colorStory}`,
          description: `${item.twist.name} (${item.twist.size}) · Hand-braided statement earrings by Twisted by NG Divine`,
          metadata: {
            collection: item.collectionName,
            colorStory: item.colorStory,
            twist: item.twist.name,
            size: item.twist.size,
          },
        },
      },
      quantity: item.quantity,
    }));

    // ── Shipping line item ──────────────────────────────────────────────────
    lineItems.push({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(shipping.rate * 100),
        product_data: {
          name: `Shipping — ${shipping.countryName}`,
          description: `Standard shipping · ${shipping.days}`,
        },
      },
      quantity: 1,
    });

    // ── Confidence Card line item (free, always included) ──────────────────
    lineItems.push({
      price_data: {
        currency: "usd",
        unit_amount: 0,
        product_data: {
          name: "✦ Confidence Card",
          description: "A randomly selected collectible Confidence Card — included with every order.",
        },
      },
      quantity: 1,
    });

    // ── Promo coupon ────────────────────────────────────────────────────────
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    if (promoCode && promoDiscount && promoDiscount > 0) {
      // Reuse or create a Stripe coupon for this promo code
      const couponId = `PROMO_${promoCode.toUpperCase()}`;
      let coupon: Stripe.Coupon | null = null;
      try {
        coupon = await stripe.coupons.retrieve(couponId);
      } catch {
        // Create it if it doesn't exist yet
        coupon = await stripe.coupons.create({
          id: couponId,
          percent_off: promoDiscount * 100,
          duration: "once",
          name: promoCode.toUpperCase(),
        });
      }
      discounts = [{ coupon: coupon.id }];
    }

    // ── Look up existing Stripe customer ────────────────────────────────────
    let customerId: string | undefined;
    const existing = await stripe.customers.list({ email: customerEmail, limit: 1 });
    if (existing.data.length > 0) {
      customerId = existing.data[0].id;
    }

    const origin = req.headers.get("origin") ?? "https://twistedbyngdivine.com";

    // ── Create Checkout Session ─────────────────────────────────────────────
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: lineItems,
      mode: "payment",
      discounts,
      billing_address_collection: "auto",
      success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        brand: "Twisted by NG Divine",
        promoCode: promoCode ?? "",
        itemCount: String(items.reduce((s, i) => s + i.quantity, 0)),
      },
    });

    console.log("Stripe session created:", session.id);

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("create-payment error:", error.message);
    return new Response(
      JSON.stringify({ error: `Stripe: ${error.message}` }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

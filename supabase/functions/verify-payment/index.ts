// verify-payment — Twisted by NG Divine
// Verifies a Stripe Checkout Session and sends a branded order confirmation email via Resend.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { corsHeaders } from "../_shared/cors.ts";

// ── Email HTML builder ──────────────────────────────────────────────────────

function buildOrderEmailHtml(opts: {
  customerEmail: string;
  orderNumber: string;
  sessionId: string;
  lineItems: Stripe.LineItem[];
  amountTotal: number; // cents
}): string {
  const { orderNumber, lineItems, amountTotal } = opts;

  // Filter out Confidence Card + Shipping for the items list
  const earringItems = lineItems.filter(
    li => !li.description?.toLowerCase().includes('confidence card') &&
          !li.description?.toLowerCase().includes('shipping')
  );
  const shippingItem = lineItems.find(li =>
    li.description?.toLowerCase().includes('shipping') ||
    li.price?.product_data?.name?.toLowerCase().includes('shipping')
  );
  const confidenceItem = lineItems.find(li =>
    li.description?.toLowerCase().includes('confidence card') ||
    li.price?.product_data?.name?.includes('Confidence Card')
  );

  const itemsHtml = earringItems.map(item => {
    const name = item.description ?? item.price?.product_data?.name ?? 'Twisted Earrings';
    const qty  = item.quantity ?? 1;
    const price = ((item.amount_total ?? 0) / 100).toFixed(2);
    return `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #2a1a2e;">
          <span style="font-size:13px;color:#ffffff;font-weight:600;display:block;margin-bottom:3px;">${name}</span>
          <span style="font-size:11px;color:#ff69b4;">Qty: ${qty}</span>
        </td>
        <td style="padding:14px 0;border-bottom:1px solid #2a1a2e;text-align:right;font-size:13px;color:#aaff00;font-weight:700;">$${price}</td>
      </tr>`;
  }).join('');

  const shippingRow = shippingItem
    ? `<tr>
        <td style="padding:10px 0;font-size:12px;color:#ffffff80;">Shipping (${shippingItem.description ?? ''})</td>
        <td style="padding:10px 0;text-align:right;font-size:12px;color:#ffffff80;">$${((shippingItem.amount_total ?? 0) / 100).toFixed(2)}</td>
       </tr>`
    : '';

  const totalFormatted = (amountTotal / 100).toFixed(2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Order Confirmed — Twisted by NG Divine</title>
</head>
<body style="margin:0;padding:0;background:#0d0d00;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Candy stripe top bar -->
  <div style="height:5px;background:linear-gradient(90deg,#ff1493,#bf00ff,#aaff00,#ff69b4,#ff1493);"></div>

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d00;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Logo / brand header -->
        <tr><td style="padding:32px 0 24px;text-align:center;">
          <div style="display:inline-block;width:52px;height:52px;border-radius:50%;border:2px solid #ff1493;background:linear-gradient(135deg,#ff149322,#bf00ff22);line-height:52px;text-align:center;font-size:18px;font-style:italic;font-weight:900;color:#ff1493;margin-bottom:14px;">NG</div>
          <p style="margin:6px 0 2px;font-size:22px;font-weight:900;letter-spacing:0.18em;color:#ffffff;text-transform:uppercase;">TWISTED</p>
          <p style="margin:0;font-size:10px;letter-spacing:0.3em;color:#ff69b4;text-transform:uppercase;">BY NG DIVINE</p>
        </td></tr>

        <!-- Hero banner -->
        <tr><td style="background:linear-gradient(135deg,#2a001a,#1a0035);border-radius:20px;padding:40px 32px;text-align:center;border:1px solid #ff149330;">
          <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.3em;color:#aaff00;text-transform:uppercase;">✦ Order Confirmed ✦</p>
          <h1 style="margin:0 0 8px;font-size:42px;font-weight:900;letter-spacing:-0.02em;color:#ffffff;line-height:1;">TWISTED</h1>
          <h1 style="margin:0 0 20px;font-size:42px;font-weight:900;letter-spacing:-0.02em;color:#ff1493;line-height:1;">&amp; DELIVERED.</h1>
          <p style="margin:0;font-size:14px;color:#ffffff80;line-height:1.7;">Your order is confirmed. Your twists are being<br/>handmade with love and care.</p>
        </td></tr>

        <!-- Order reference -->
        <tr><td style="padding:24px 0 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#111100;border:1px solid #ff149330;border-radius:16px;overflow:hidden;">
            <tr><td style="padding:20px 24px;text-align:center;">
              <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.3em;color:#ffffff40;text-transform:uppercase;">Order Reference</p>
              <p style="margin:0;font-size:28px;font-weight:900;letter-spacing:0.15em;color:#ff1493;">${orderNumber}</p>
            </td></tr>
          </table>
        </td></tr>

        <!-- Order items -->
        <tr><td style="padding:24px 0 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#111100;border:1px solid #ffffff15;border-radius:16px;overflow:hidden;">
            <tr><td style="padding:20px 24px 0;">
              <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.25em;color:#ffffff40;text-transform:uppercase;">Your Items</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemsHtml}
                ${shippingRow}
              </table>
            </td></tr>
            <tr><td style="padding:16px 24px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:14px;font-weight:700;color:#ffffff;">Total Paid</td>
                  <td style="text-align:right;font-size:24px;font-weight:900;color:#aaff00;">$${totalFormatted}</td>
                </tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- Confidence Card callout -->
        ${confidenceItem ? `
        <tr><td style="padding:20px 0 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#aaff0015,#00000000);border:1px solid #aaff0040;border-radius:16px;">
            <tr><td style="padding:20px 24px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:36px;vertical-align:middle;font-size:22px;">✦</td>
                  <td style="padding-left:12px;vertical-align:middle;">
                    <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#aaff00;">Confidence Card Included</p>
                    <p style="margin:0;font-size:12px;color:#ffffff60;line-height:1.5;">A randomly selected collectible Confidence Card has been chosen for your order. It's our way of reminding you who you are — beautiful, bold, and one-of-a-kind.</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </td></tr>` : ''}

        <!-- What's next -->
        <tr><td style="padding:24px 0 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#111100;border:1px solid #ffffff10;border-radius:16px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.25em;color:#ffffff40;text-transform:uppercase;">What Happens Next</p>
              <table cellpadding="0" cellspacing="0" width="100%">
                ${[
                  ['✦', '#ff1493', 'Handcrafted With Care', 'Your earrings are being hand-braided just for you. No two pairs are exactly alike.'],
                  ['♡', '#ff69b4', 'Packed & Shipped', 'Tracking info will arrive via email once your order ships.'],
                  ['✧', '#aaff00', 'Surprise Inside', 'Your Confidence Card is packed and ready. We can\'t wait for you to see it.'],
                ].map(([icon, color, title, desc]) => `
                  <tr>
                    <td style="width:36px;vertical-align:top;padding-bottom:16px;font-size:18px;color:${color};">${icon}</td>
                    <td style="padding-left:12px;padding-bottom:16px;vertical-align:top;">
                      <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#ffffff;">${title}</p>
                      <p style="margin:0;font-size:12px;color:#ffffff50;line-height:1.5;">${desc}</p>
                    </td>
                  </tr>`).join('')}
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- Social CTA -->
        <tr><td style="padding:28px 0 0;text-align:center;">
          <p style="margin:0 0 6px;font-size:13px;color:#ffffff60;">Share your unboxing moment with us ✦</p>
          <p style="margin:0 0 20px;font-size:14px;font-weight:700;color:#ff1493;">@nubiancolourgoddess</p>
          <a href="https://instagram.com/nubiancolourgoddess"
             style="display:inline-block;background:#ff1493;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:50px;margin:0 6px;">
            Instagram ♡
          </a>
          <a href="https://www.tiktok.com/@natashadyson6"
             style="display:inline-block;background:transparent;color:#aaff00;border:2px solid #aaff00;font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;padding:12px 28px;border-radius:50px;margin:0 6px;">
            TikTok ✦
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:36px 0 20px;text-align:center;border-top:1px solid #ffffff0d;margin-top:28px;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:700;letter-spacing:0.15em;color:#ffffff80;text-transform:uppercase;">Twisted by NG Divine</p>
          <p style="margin:0 0 12px;font-size:11px;font-style:italic;color:#ff69b4;">Designed To Bend The Rules.</p>
          <p style="margin:0;font-size:10px;color:#ffffff30;">Questions? Contact us at <a href="mailto:twistedbyngdivine@gmail.com" style="color:#ff69b4;text-decoration:none;">twistedbyngdivine@gmail.com</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>

  <!-- Candy stripe bottom bar -->
  <div style="height:5px;background:linear-gradient(90deg,#aaff00,#bf00ff,#ff1493,#ff69b4,#aaff00);"></div>

</body>
</html>`;
}

// ── Main handler ────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      throw new Error("sessionId is required.");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve session and expand line_items so we have full product details
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    });

    console.log("Session retrieved:", session.id, "| payment:", session.payment_status);

    const isPaid     = session.payment_status === "paid";
    const custEmail  = session.customer_details?.email ?? session.customer_email ?? "";
    const lineItems  = session.line_items?.data ?? [];
    const orderNumber = `TNG-${sessionId.replace("cs_", "").substring(0, 8).toUpperCase()}`;

    // ── Send confirmation email if payment confirmed ─────────────────────────
    if (isPaid && custEmail) {
      const resendKey = Deno.env.get("RESEND_API_KEY");

      if (resendKey) {
        const html = buildOrderEmailHtml({
          customerEmail: custEmail,
          orderNumber,
          sessionId,
          lineItems,
          amountTotal: session.amount_total ?? 0,
        });

        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "Twisted by NG Divine <orders@twistedbyngdivine.com>",
            to: [custEmail],
            subject: `✦ Order Confirmed — ${orderNumber} | Twisted by NG Divine`,
            html,
          }),
        });

        const emailData = await emailRes.json();
        if (!emailRes.ok) {
          // Non-fatal — log but don't fail the verification
          console.warn("Resend email failed (non-fatal):", JSON.stringify(emailData));
        } else {
          console.log("Confirmation email sent:", emailData.id, "→", custEmail);
        }
      } else {
        console.warn("RESEND_API_KEY not set — skipping confirmation email.");
      }
    }

    return new Response(
      JSON.stringify({
        status:        session.status,
        paymentStatus: session.payment_status,
        customerEmail: custEmail,
        amountTotal:   session.amount_total,
        currency:      session.currency,
        metadata:      session.metadata,
        orderNumber,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("verify-payment error:", error.message);
    return new Response(
      JSON.stringify({ error: `Stripe: ${error.message}` }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

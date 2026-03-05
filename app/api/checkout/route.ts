import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  console.log("POST /api/checkout — start");

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      success_url: `${origin}/dashboard?upgraded=1`,
      cancel_url: `${origin}/pricing`,
      metadata: { user_id: user?.id ?? "" },
    };

    if (user?.email) {
      sessionParams.customer_email = user.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log("POST /api/checkout — done");
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.log("POST /api/checkout — error:", String(err));
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

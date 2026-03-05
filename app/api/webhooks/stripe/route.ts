import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  console.log("POST /api/webhooks/stripe — start");

  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.log("POST /api/webhooks/stripe — invalid signature:", String(err));
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;

    if (userId) {
      await supabase
        .from("profiles")
        .update({
          subscription_status: "pro",
          stripe_customer_id: session.customer as string,
        })
        .eq("id", userId);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    // Look up by stripe_customer_id first
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();

    if (profile) {
      await supabase
        .from("profiles")
        .update({ subscription_status: "free" })
        .eq("id", profile.id);
    } else {
      // Fallback: look up by email from Stripe customer
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      const customer = await stripe.customers.retrieve(customerId);
      if (!customer.deleted && customer.email) {
        await supabase
          .from("profiles")
          .update({ subscription_status: "free" })
          .eq("email", customer.email);
      }
    }
  }

  console.log("POST /api/webhooks/stripe — done");
  return NextResponse.json({ received: true });
}

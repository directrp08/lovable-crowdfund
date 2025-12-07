import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DonationRequest {
  amount: number; // Amount in dollars
  isRecurring: boolean;
  tipAmount: number;
  donorEmail?: string;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-DONATION-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const { amount, isRecurring, tipAmount, donorEmail }: DonationRequest = await req.json();
    logStep("Request data", { amount, isRecurring, tipAmount, donorEmail });

    if (!amount || amount <= 0) {
      throw new Error("Invalid donation amount");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Convert to cents
    const donationAmountCents = Math.round(amount * 100);
    const tipAmountCents = Math.round(tipAmount * 100);
    const totalAmountCents = donationAmountCents + tipAmountCents;

    logStep("Amounts calculated", { donationAmountCents, tipAmountCents, totalAmountCents });

    // Create line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (isRecurring) {
      // For recurring donations, create a price with product
      lineItems.push({
        price_data: {
          currency: "usd",
          unit_amount: donationAmountCents,
          recurring: { interval: "month" },
          product_data: {
            name: "Monthly Donation",
            description: "Help Katie Recover and Honor Gavin's Memory",
          },
        },
        quantity: 1,
      });

      // Add tip as separate recurring item if present
      if (tipAmountCents > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            unit_amount: tipAmountCents,
            recurring: { interval: "month" },
            product_data: {
              name: "Monthly Platform Tip",
              description: "Thank you for supporting our platform",
            },
          },
          quantity: 1,
        });
      }
    } else {
      // One-time donation
      lineItems.push({
        price_data: {
          currency: "usd",
          unit_amount: donationAmountCents,
          product_data: {
            name: "Donation",
            description: "Help Katie Recover and Honor Gavin's Memory",
          },
        },
        quantity: 1,
      });

      // Add tip as separate item if present
      if (tipAmountCents > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            unit_amount: tipAmountCents,
            product_data: {
              name: "Platform Tip",
              description: "Thank you for supporting our platform",
            },
          },
          quantity: 1,
        });
      }
    }

    logStep("Line items created", { itemCount: lineItems.length });

    // Check if customer exists
    let customerId: string | undefined;
    if (donorEmail) {
      const customers = await stripe.customers.list({ email: donorEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Found existing customer", { customerId });
      }
    }

    const origin = req.headers.get("origin") || "http://localhost:5173";

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : donorEmail,
      line_items: lineItems,
      mode: isRecurring ? "subscription" : "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        donation_amount: amount.toString(),
        tip_amount: tipAmount.toString(),
        is_recurring: isRecurring.toString(),
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

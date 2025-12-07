import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentIntentRequest {
  amount: number; // Amount in dollars
  tipAmount: number;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT-INTENT] ${step}${detailsStr}`);
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

    const publishableKey = Deno.env.get("STRIPE_PUBLISHABLE_KEY");
    if (!publishableKey) throw new Error("STRIPE_PUBLISHABLE_KEY is not set");

    logStep("Keys verified");

    const { amount, tipAmount }: PaymentIntentRequest = await req.json();
    logStep("Request data", { amount, tipAmount });

    if (!amount || amount <= 0) {
      throw new Error("Invalid donation amount");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Convert to cents
    const donationAmountCents = Math.round(amount * 100);
    const tipAmountCents = Math.round(tipAmount * 100);
    const totalAmountCents = donationAmountCents + tipAmountCents;

    logStep("Amounts calculated", { donationAmountCents, tipAmountCents, totalAmountCents });

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountCents,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        donation_amount: amount.toString(),
        tip_amount: tipAmount.toString(),
      },
    });

    logStep("Payment Intent created", { 
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret?.substring(0, 20) + "..."
    });

    return new Response(JSON.stringify({ 
      clientSecret: paymentIntent.client_secret,
      publishableKey: publishableKey,
    }), {
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

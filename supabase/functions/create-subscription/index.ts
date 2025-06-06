
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    // Use service role key for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { plan_type } = await req.json();
    if (!plan_type) throw new Error("Plan type is required");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
      logStep("Created new customer", { customerId });
    }

    // Define price mapping - FIXED: Using numbers instead of strings
    const priceMapping: Record<string, { price: number, interval: string }> = {
      'monthly': { price: 1900, interval: 'month' }, // $19/month
      'yearly': { price: 14400, interval: 'year' }   // $144/year
    };

    const planConfig = priceMapping[plan_type];
    if (!planConfig) throw new Error("Invalid plan type");

    logStep("Creating checkout session", { 
      planType: plan_type, 
      unitAmount: planConfig.price, 
      unitAmountType: typeof planConfig.price,
      interval: planConfig.interval 
    });

    // Create checkout session - CRITICAL FIX: Ensure unit_amount is a number
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "FitGenius Pro Subscription",
              description: "Unlimited AI generations, premium features"
            },
            unit_amount: Number(planConfig.price), // EXPLICIT conversion to number
            recurring: { interval: planConfig.interval as 'month' | 'year' },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/pro?subscription=success`,
      cancel_url: `${req.headers.get("origin")}/pro?subscription=cancelled`,
      metadata: {
        user_id: user.id,
        plan_type: plan_type
      }
    });

    // Create pending subscription record
    const { error: subError } = await supabaseClient
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        stripe_subscription_id: null, // Will be set by webhook
        status: 'pending',
        plan_type: plan_type,
        current_period_start: null,
        current_period_end: null,
        cancel_at_period_end: false,
        stripe_price_id: null, // Will be set by webhook
        interval: planConfig.interval
      }, { onConflict: 'user_id' });

    if (subError) {
      console.error('Error creating subscription record:', subError);
      throw new Error('Failed to create subscription record');
    }

    logStep("Checkout session created successfully", { 
      sessionId: session.id, 
      url: session.url,
      unitAmountSent: Number(planConfig.price),
      unitAmountType: typeof Number(planConfig.price),
      metadata: session.metadata
    });

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

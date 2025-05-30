
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey || !webhookSecret) {
      throw new Error("Missing Stripe configuration");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Use service role key for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    logStep("Webhook verified", { eventType: event.type, eventId: event.id });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Processing checkout completion", { sessionId: session.id });

        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const userId = session.metadata?.user_id;
          
          if (!userId) {
            throw new Error("No user_id in session metadata");
          }

          // Update subscription record
          const { error: subError } = await supabaseClient
            .from('subscriptions')
            .update({
              stripe_subscription_id: subscription.id,
              status: 'active',
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              stripe_price_id: subscription.items.data[0].price.id
            })
            .eq('user_id', userId);

          if (subError) {
            console.error('Error updating subscription:', subError);
            throw new Error('Failed to update subscription');
          }

          // Update user role to pro
          const { error: roleError } = await supabaseClient
            .from('profiles')
            .update({ role: 'pro' })
            .eq('id', userId);

          if (roleError) {
            console.error('Error updating user role:', roleError);
            throw new Error('Failed to update user role');
          }

          logStep("User upgraded to pro", { userId, subscriptionId: subscription.id });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Processing successful payment", { invoiceId: invoice.id });

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          
          // Find user by customer ID
          const { data: subRecord, error: findError } = await supabaseClient
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_subscription_id', subscription.id)
            .single();

          if (findError || !subRecord) {
            console.error('Subscription not found:', findError);
            break;
          }

          // Update subscription period
          const { error: updateError } = await supabaseClient
            .from('subscriptions')
            .update({
              status: 'active',
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end
            })
            .eq('stripe_subscription_id', subscription.id);

          if (updateError) {
            console.error('Error updating subscription period:', updateError);
          }

          logStep("Subscription period updated", { userId: subRecord.user_id });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Processing subscription deletion", { subscriptionId: subscription.id });

        // Find user by subscription ID
        const { data: subRecord, error: findError } = await supabaseClient
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (findError || !subRecord) {
          console.error('Subscription not found:', findError);
          break;
        }

        // Update subscription status
        const { error: subError } = await supabaseClient
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', subscription.id);

        if (subError) {
          console.error('Error updating subscription status:', subError);
        }

        // Downgrade user role back to normal and reset AI generations
        const { error: roleError } = await supabaseClient
          .from('profiles')
          .update({ 
            role: 'normal',
            ai_generations_remaining: 5 // Reset to default
          })
          .eq('id', subRecord.user_id);

        if (roleError) {
          console.error('Error downgrading user role:', roleError);
        }

        logStep("User downgraded to normal", { userId: subRecord.user_id });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Processing subscription update", { subscriptionId: subscription.id });

        // Find user by subscription ID
        const { data: subRecord, error: findError } = await supabaseClient
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (findError || !subRecord) {
          console.error('Subscription not found:', findError);
          break;
        }

        // Update subscription details
        const { error: updateError } = await supabaseClient
          .from('subscriptions')
          .update({
            status: subscription.status === 'active' ? 'active' : subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end
          })
          .eq('stripe_subscription_id', subscription.id);

        if (updateError) {
          console.error('Error updating subscription:', updateError);
        }

        logStep("Subscription updated", { userId: subRecord.user_id, status: subscription.status });
        break;
      }

      default:
        logStep("Unhandled event type", { eventType: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});

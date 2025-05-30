
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const logStep = (step: string, details?: any) => {
  const timestamp = new Date().toISOString();
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[${timestamp}] [STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  try {
    logStep("Webhook received", { method: req.method, headers: Object.fromEntries(req.headers.entries()) });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey || !webhookSecret) {
      logStep("ERROR: Missing Stripe configuration", { stripeKey: !!stripeKey, webhookSecret: !!webhookSecret });
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
      logStep("ERROR: No Stripe signature found");
      throw new Error("No Stripe signature found");
    }

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("Webhook verified successfully", { eventType: event.type, eventId: event.id });
    } catch (err) {
      logStep("ERROR: Webhook signature verification failed", { error: err.message });
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Processing checkout completion", { 
          sessionId: session.id, 
          mode: session.mode,
          subscriptionId: session.subscription,
          metadata: session.metadata 
        });

        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const userId = session.metadata?.user_id;
          
          if (!userId) {
            logStep("ERROR: No user_id in session metadata", { metadata: session.metadata });
            throw new Error("No user_id in session metadata");
          }

          logStep("Processing subscription for user", { 
            userId, 
            subscriptionId: subscription.id,
            status: subscription.status,
            customerId: session.customer 
          });

          // Update subscription record
          const { error: subError } = await supabaseClient
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscription.id,
              status: 'active',
              plan_type: session.metadata?.plan_type || 'monthly',
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: false,
              stripe_price_id: subscription.items.data[0].price.id,
              interval: subscription.items.data[0].price.recurring?.interval || 'month'
            }, { onConflict: 'user_id' });

          if (subError) {
            logStep("ERROR: Failed to update subscription", { error: subError, userId, subscriptionId: subscription.id });
            throw new Error(`Failed to update subscription: ${subError.message}`);
          }

          logStep("Subscription updated successfully", { userId, subscriptionId: subscription.id });

          // Update user role to pro and reset AI generations
          const { error: roleError } = await supabaseClient
            .from('profiles')
            .update({ 
              role: 'pro',
              ai_generations_remaining: 999999 // Unlimited for pro users
            })
            .eq('id', userId);

          if (roleError) {
            logStep("ERROR: Failed to update user role", { error: roleError, userId });
            throw new Error(`Failed to update user role: ${roleError.message}`);
          }

          logStep("User upgraded to pro successfully", { userId, subscriptionId: subscription.id });

          // Verify the updates were successful
          const { data: updatedProfile, error: checkError } = await supabaseClient
            .from('profiles')
            .select('role, ai_generations_remaining')
            .eq('id', userId)
            .single();

          if (checkError) {
            logStep("ERROR: Failed to verify profile update", { error: checkError, userId });
          } else {
            logStep("Profile update verified", { userId, profile: updatedProfile });
          }

          const { data: updatedSub, error: subCheckError } = await supabaseClient
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single();

          if (subCheckError) {
            logStep("ERROR: Failed to verify subscription update", { error: subCheckError, userId });
          } else {
            logStep("Subscription update verified", { userId, subscription: updatedSub });
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Processing successful payment", { invoiceId: invoice.id, subscriptionId: invoice.subscription });

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          
          // Find user by subscription ID
          const { data: subRecord, error: findError } = await supabaseClient
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_subscription_id', subscription.id)
            .single();

          if (findError || !subRecord) {
            logStep("ERROR: Subscription not found for payment", { error: findError, subscriptionId: subscription.id });
            break;
          }

          // Update subscription period and ensure active status
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
            logStep("ERROR: Failed to update subscription period", { error: updateError, subscriptionId: subscription.id });
          } else {
            logStep("Subscription period updated", { userId: subRecord.user_id, subscriptionId: subscription.id });
          }

          // Ensure user still has pro role and unlimited generations
          const { error: roleError } = await supabaseClient
            .from('profiles')
            .update({ 
              role: 'pro',
              ai_generations_remaining: 999999
            })
            .eq('id', subRecord.user_id);

          if (roleError) {
            logStep("ERROR: Failed to maintain pro role", { error: roleError, userId: subRecord.user_id });
          } else {
            logStep("Pro role maintained", { userId: subRecord.user_id });
          }
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
          logStep("ERROR: Subscription not found for deletion", { error: findError, subscriptionId: subscription.id });
          break;
        }

        // Update subscription status
        const { error: subError } = await supabaseClient
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', subscription.id);

        if (subError) {
          logStep("ERROR: Failed to update subscription status to cancelled", { error: subError, subscriptionId: subscription.id });
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
          logStep("ERROR: Failed to downgrade user role", { error: roleError, userId: subRecord.user_id });
        } else {
          logStep("User downgraded to normal", { userId: subRecord.user_id });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Processing subscription update", { 
          subscriptionId: subscription.id, 
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end 
        });

        // Find user by subscription ID
        const { data: subRecord, error: findError } = await supabaseClient
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (findError || !subRecord) {
          logStep("ERROR: Subscription not found for update", { error: findError, subscriptionId: subscription.id });
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
          logStep("ERROR: Failed to update subscription", { error: updateError, subscriptionId: subscription.id });
        } else {
          logStep("Subscription updated", { userId: subRecord.user_id, status: subscription.status });
        }

        // Update user role based on subscription status
        const newRole = subscription.status === 'active' ? 'pro' : 'normal';
        const newGenerations = subscription.status === 'active' ? 999999 : 5;

        const { error: roleError } = await supabaseClient
          .from('profiles')
          .update({ 
            role: newRole,
            ai_generations_remaining: newGenerations
          })
          .eq('id', subRecord.user_id);

        if (roleError) {
          logStep("ERROR: Failed to update user role", { error: roleError, userId: subRecord.user_id });
        } else {
          logStep("User role updated", { userId: subRecord.user_id, newRole, newGenerations });
        }
        break;
      }

      default:
        logStep("Unhandled event type", { eventType: event.type });
    }

    logStep("Webhook processed successfully", { eventType: event.type, eventId: event.id });
    return new Response(JSON.stringify({ received: true, processed: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("CRITICAL ERROR in webhook processing", { message: errorMessage, stack: error instanceof Error ? error.stack : undefined });
    return new Response(JSON.stringify({ error: errorMessage, received: false }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});

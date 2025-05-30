
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
    logStep("=== WEBHOOK RECEIVED ===", { 
      method: req.method, 
      url: req.url,
      headers: Object.fromEntries(req.headers.entries()) 
    });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey || !webhookSecret) {
      logStep("❌ CRITICAL ERROR: Missing Stripe configuration", { 
        stripeKey: !!stripeKey, 
        webhookSecret: !!webhookSecret 
      });
      throw new Error("Missing Stripe configuration");
    }

    logStep("✅ Stripe configuration verified");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Use service role key for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    logStep("✅ Supabase client initialized with service role");

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      logStep("❌ ERROR: No Stripe signature found in headers");
      throw new Error("No Stripe signature found");
    }

    logStep("✅ Stripe signature found, verifying webhook...");

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("✅ WEBHOOK VERIFIED SUCCESSFULLY", { 
        eventType: event.type, 
        eventId: event.id,
        created: event.created 
      });
    } catch (err) {
      logStep("❌ WEBHOOK VERIFICATION FAILED", { 
        error: err.message,
        signature: signature.substring(0, 20) + "..." 
      });
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    logStep(`🔄 PROCESSING EVENT: ${event.type}`, { eventId: event.id });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("💰 CHECKOUT SESSION COMPLETED", { 
          sessionId: session.id, 
          mode: session.mode,
          subscriptionId: session.subscription,
          customerId: session.customer,
          metadata: session.metadata,
          paymentStatus: session.payment_status,
          status: session.status
        });

        if (session.mode === 'subscription' && session.subscription) {
          logStep("📋 Retrieving subscription details from Stripe...");
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const userId = session.metadata?.user_id;
          
          if (!userId) {
            logStep("❌ CRITICAL ERROR: No user_id in session metadata", { 
              metadata: session.metadata,
              sessionId: session.id 
            });
            throw new Error("No user_id in session metadata");
          }

          logStep("👤 PROCESSING SUBSCRIPTION FOR USER", { 
            userId, 
            subscriptionId: subscription.id,
            status: subscription.status,
            customerId: session.customer,
            currentPeriodStart: subscription.current_period_start,
            currentPeriodEnd: subscription.current_period_end,
            priceId: subscription.items.data[0]?.price?.id,
            interval: subscription.items.data[0]?.price?.recurring?.interval
          });

          // First, let's check if user exists in profiles
          logStep("🔍 Checking if user profile exists...");
          const { data: existingProfile, error: profileCheckError } = await supabaseClient
            .from('profiles')
            .select('id, role, ai_generations_remaining')
            .eq('id', userId)
            .single();

          if (profileCheckError) {
            logStep("❌ CRITICAL ERROR: User profile not found", { 
              error: profileCheckError, 
              userId,
              code: profileCheckError.code 
            });
            throw new Error(`User profile not found: ${profileCheckError.message}`);
          }

          logStep("✅ User profile found", { 
            userId: existingProfile.id,
            currentRole: existingProfile.role,
            currentGenerations: existingProfile.ai_generations_remaining
          });

          // Create comprehensive subscription record
          const subscriptionRecord = {
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            status: 'active',
            plan_type: session.metadata?.plan_type || 'monthly',
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end || false,
            stripe_price_id: subscription.items.data[0]?.price?.id || null,
            interval: subscription.items.data[0]?.price?.recurring?.interval || 'month'
          };

          logStep("💾 UPSERTING SUBSCRIPTION RECORD", { subscriptionRecord });

          const { data: upsertedSub, error: subError } = await supabaseClient
            .from('subscriptions')
            .upsert(subscriptionRecord, { onConflict: 'user_id' })
            .select()
            .single();

          if (subError) {
            logStep("❌ CRITICAL ERROR: Failed to upsert subscription", { 
              error: subError, 
              userId, 
              subscriptionId: subscription.id,
              code: subError.code,
              details: subError.details
            });
            throw new Error(`Failed to upsert subscription: ${subError.message}`);
          }

          logStep("✅ SUBSCRIPTION RECORD CREATED/UPDATED", { 
            subscriptionDbId: upsertedSub.id,
            status: upsertedSub.status,
            planType: upsertedSub.plan_type
          });

          // Update user role to pro and set unlimited AI generations
          const profileUpdate = {
            role: 'pro',
            ai_generations_remaining: 999999 // Unlimited for pro users
          };

          logStep("👑 UPDATING USER TO PRO STATUS", { userId, profileUpdate });

          const { data: updatedProfile, error: roleError } = await supabaseClient
            .from('profiles')
            .update(profileUpdate)
            .eq('id', userId)
            .select()
            .single();

          if (roleError) {
            logStep("❌ CRITICAL ERROR: Failed to update user role", { 
              error: roleError, 
              userId,
              code: roleError.code
            });
            throw new Error(`Failed to update user role: ${roleError.message}`);
          }

          logStep("✅ USER SUCCESSFULLY UPGRADED TO PRO", { 
            userId, 
            newRole: updatedProfile.role,
            newGenerations: updatedProfile.ai_generations_remaining
          });

          // Final verification - fetch fresh data to confirm updates
          logStep("🔍 PERFORMING FINAL VERIFICATION...");
          
          const { data: finalProfile, error: finalProfileError } = await supabaseClient
            .from('profiles')
            .select('role, ai_generations_remaining')
            .eq('id', userId)
            .single();

          const { data: finalSub, error: finalSubError } = await supabaseClient
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active')
            .single();

          if (finalProfileError || finalSubError) {
            logStep("❌ FINAL VERIFICATION FAILED", { 
              profileError: finalProfileError, 
              subError: finalSubError, 
              userId 
            });
          } else {
            logStep("✅ FINAL VERIFICATION SUCCESSFUL - SUBSCRIPTION COMPLETE", { 
              userId, 
              finalProfile, 
              finalSub: {
                id: finalSub.id,
                status: finalSub.status,
                planType: finalSub.plan_type,
                stripeId: finalSub.stripe_subscription_id
              },
              subscriptionActive: finalSub?.status === 'active',
              roleIsPro: finalProfile?.role === 'pro'
            });
          }
        } else {
          logStep("ℹ️ Skipping non-subscription checkout session", { 
            mode: session.mode,
            sessionId: session.id 
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("💳 INVOICE PAYMENT SUCCEEDED", { 
          invoiceId: invoice.id, 
          subscriptionId: invoice.subscription,
          amount: invoice.amount_paid,
          currency: invoice.currency
        });

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          
          // Find user by subscription ID
          const { data: subRecord, error: findError } = await supabaseClient
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_subscription_id', subscription.id)
            .single();

          if (findError || !subRecord) {
            logStep("❌ ERROR: Subscription not found for payment", { 
              error: findError, 
              subscriptionId: subscription.id 
            });
            break;
          }

          logStep("🔄 PROCESSING SUBSCRIPTION RENEWAL", { 
            userId: subRecord.user_id, 
            subscriptionId: subscription.id 
          });

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
            logStep("❌ ERROR: Failed to update subscription period", { 
              error: updateError, 
              subscriptionId: subscription.id 
            });
          } else {
            logStep("✅ Subscription period updated successfully", { 
              userId: subRecord.user_id, 
              subscriptionId: subscription.id 
            });
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
            logStep("❌ ERROR: Failed to maintain pro role", { 
              error: roleError, 
              userId: subRecord.user_id 
            });
          } else {
            logStep("✅ Pro role maintained successfully", { 
              userId: subRecord.user_id 
            });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("❌ SUBSCRIPTION DELETED", { 
          subscriptionId: subscription.id,
          canceledAt: subscription.canceled_at,
          endedAt: subscription.ended_at
        });

        // Find user by subscription ID
        const { data: subRecord, error: findError } = await supabaseClient
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (findError || !subRecord) {
          logStep("❌ ERROR: Subscription not found for deletion", { 
            error: findError, 
            subscriptionId: subscription.id 
          });
          break;
        }

        logStep("🔄 PROCESSING SUBSCRIPTION CANCELLATION", { 
          userId: subRecord.user_id, 
          subscriptionId: subscription.id 
        });

        // Update subscription status to cancelled
        const { error: subError } = await supabaseClient
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', subscription.id);

        if (subError) {
          logStep("❌ ERROR: Failed to update subscription status to cancelled", { 
            error: subError, 
            subscriptionId: subscription.id 
          });
        } else {
          logStep("✅ Subscription marked as cancelled", { 
            userId: subRecord.user_id, 
            subscriptionId: subscription.id 
          });
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
          logStep("❌ ERROR: Failed to downgrade user role", { 
            error: roleError, 
            userId: subRecord.user_id 
          });
        } else {
          logStep("✅ User downgraded to normal successfully", { 
            userId: subRecord.user_id 
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("🔄 SUBSCRIPTION UPDATED", { 
          subscriptionId: subscription.id, 
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          currentPeriodEnd: subscription.current_period_end
        });

        // Find user by subscription ID
        const { data: subRecord, error: findError } = await supabaseClient
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (findError || !subRecord) {
          logStep("❌ ERROR: Subscription not found for update", { 
            error: findError, 
            subscriptionId: subscription.id 
          });
          break;
        }

        logStep("🔄 PROCESSING SUBSCRIPTION UPDATE", { 
          userId: subRecord.user_id, 
          subscriptionId: subscription.id 
        });

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
          logStep("❌ ERROR: Failed to update subscription", { 
            error: updateError, 
            subscriptionId: subscription.id 
          });
        } else {
          logStep("✅ Subscription updated successfully", { 
            userId: subRecord.user_id, 
            status: subscription.status 
          });
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
          logStep("❌ ERROR: Failed to update user role based on subscription status", { 
            error: roleError, 
            userId: subRecord.user_id 
          });
        } else {
          logStep("✅ User role updated based on subscription status", { 
            userId: subRecord.user_id, 
            newRole, 
            newGenerations 
          });
        }
        break;
      }

      default:
        logStep(`ℹ️ Unhandled event type: ${event.type}`, { eventId: event.id });
    }

    logStep("🎉 WEBHOOK PROCESSING COMPLETED SUCCESSFULLY", { 
      eventType: event.type, 
      eventId: event.id,
      processingTime: Date.now() - new Date(event.created * 1000).getTime()
    });
    
    return new Response(JSON.stringify({ 
      received: true, 
      processed: true,
      eventType: event.type,
      eventId: event.id 
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("💥 CRITICAL ERROR IN WEBHOOK PROCESSING", { 
      message: errorMessage, 
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    return new Response(JSON.stringify({ 
      error: errorMessage, 
      received: false,
      timestamp: new Date().toISOString()
    }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});

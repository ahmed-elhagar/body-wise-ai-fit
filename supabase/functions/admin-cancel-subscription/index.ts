
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADMIN-CANCEL-SUBSCRIPTION] ${step}${detailsStr}`);
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
    
    const adminUser = userData.user;
    if (!adminUser) throw new Error("User not authenticated");

    // Check if user is admin
    const { data: adminProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', adminUser.id)
      .single();

    if (profileError || adminProfile?.role !== 'admin') {
      throw new Error("Unauthorized: Admin access required");
    }

    logStep("Admin authenticated", { adminId: adminUser.id });

    const { target_user_id, refund } = await req.json();
    if (!target_user_id) throw new Error("Target user ID is required");

    // Get target user's subscription
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', target_user_id)
      .eq('status', 'active')
      .single();

    if (subError || !subscription) {
      throw new Error("No active subscription found for target user");
    }

    if (!subscription.stripe_subscription_id) {
      throw new Error("No Stripe subscription ID found");
    }

    logStep("Found target subscription", { 
      targetUserId: target_user_id,
      subscriptionId: subscription.stripe_subscription_id 
    });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Cancel subscription immediately
    const cancelledSubscription = await stripe.subscriptions.cancel(
      subscription.stripe_subscription_id,
      refund ? { prorate: true } : undefined
    );

    // Update subscription status
    const { error: updateError } = await supabaseClient
      .from('subscriptions')
      .update({ 
        status: 'cancelled',
        cancel_at_period_end: false
      })
      .eq('user_id', target_user_id);

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      throw new Error('Failed to update subscription status');
    }

    // Update user role back to normal
    const { error: roleError } = await supabaseClient
      .from('profiles')
      .update({ 
        role: 'normal',
        ai_generations_remaining: 5 // Reset to default
      })
      .eq('id', target_user_id);

    if (roleError) {
      console.error('Error updating user role:', roleError);
      throw new Error('Failed to update user role');
    }

    // Log admin action
    const { error: auditError } = await supabaseClient
      .from('audit_logs')
      .insert({
        admin_user_id: adminUser.id,
        target_user_id: target_user_id,
        action: 'cancel_subscription',
        details: {
          subscription_id: subscription.stripe_subscription_id,
          refund_applied: !!refund,
          cancelled_at: new Date().toISOString()
        }
      });

    if (auditError) {
      console.error('Error logging audit action:', auditError);
    }

    logStep("Subscription cancelled by admin", { 
      subscriptionId: subscription.stripe_subscription_id,
      refundApplied: !!refund,
      targetUserId: target_user_id,
      adminId: adminUser.id
    });

    return new Response(JSON.stringify({ 
      success: true,
      message: "Subscription cancelled successfully",
      refund_applied: !!refund
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

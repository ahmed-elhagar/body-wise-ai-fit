
import React from "react";
import { Button } from "@/components/ui/button";
import { Crown, Zap, ArrowRight, Shield, Star } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useRole } from "@/hooks/useRole";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";

export const SidebarFooterActions = () => {
  const { subscription, createCheckoutSession, isCreatingCheckout } = useSubscription();
  const { isAdmin, isCoach, role } = useRole();
  const { isRTL } = useI18n();
  
  const isPro = subscription?.status === 'active';
  const shouldShowUpgrade = !isPro && !isAdmin && !isCoach;

  const handleUpgrade = () => {
    createCheckoutSession({ planType: 'monthly' });
  };

  // Show pro status for pro users
  if (isPro) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
        <div className={cn(
          "flex items-center gap-3 text-sm",
          isRTL && "flex-row-reverse"
        )}>
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div className={cn("flex-1", isRTL && "text-right")}>
            <div className="font-semibold text-yellow-800">Pro Active</div>
            <div className="text-xs text-yellow-600">Premium features unlocked</div>
          </div>
        </div>
      </div>
    );
  }

  // Show admin status for admins
  if (isAdmin) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-3">
        <div className={cn(
          "flex items-center gap-3 text-sm",
          isRTL && "flex-row-reverse"
        )}>
          <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-pink-400 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className={cn("flex-1", isRTL && "text-right")}>
            <div className="font-semibold text-red-800">Admin Access</div>
            <div className="text-xs text-red-600">Full system privileges</div>
          </div>
        </div>
      </div>
    );
  }

  // Show coach status for coaches
  if (isCoach) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
        <div className={cn(
          "flex items-center gap-3 text-sm",
          isRTL && "flex-row-reverse"
        )}>
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
            <Star className="w-4 h-4 text-white" />
          </div>
          <div className={cn("flex-1", isRTL && "text-right")}>
            <div className="font-semibold text-green-800">Coach Access</div>
            <div className="text-xs text-green-600">Training privileges</div>
          </div>
        </div>
      </div>
    );
  }

  // Show upgrade option only for regular users
  if (shouldShowUpgrade) {
    return (
      <div className="space-y-2">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
          <div className={cn("text-center", isRTL && "text-right")}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-blue-600 mb-3">
              Unlock unlimited AI generations and premium features
            </p>
            <Button
              onClick={handleUpgrade}
              disabled={isCreatingCheckout}
              size="sm"
              className={cn(
                "w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-sm",
                isRTL && "flex-row-reverse"
              )}
            >
              {isCreatingCheckout ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Now
                  <ArrowRight className="w-3 h-3 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default return for any edge cases
  return null;
};

export default SidebarFooterActions;

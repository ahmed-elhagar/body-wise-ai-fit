
import React from "react";
import { Button } from "@/components/ui/button";
import { Crown, Zap, ArrowRight } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";

export const SidebarFooterActions = () => {
  const { subscription, createCheckoutSession, isCreatingCheckout } = useSubscription();
  const { isRTL } = useI18n();
  
  const isPro = subscription?.status === 'active';

  const handleUpgrade = () => {
    createCheckoutSession({ planType: 'monthly' });
  };

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
};

export default SidebarFooterActions;

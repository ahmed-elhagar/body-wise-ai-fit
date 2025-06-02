
import React from 'react';
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import EnhancedLoadingIndicator from "@/components/ui/enhanced-loading-indicator";
import { useLanguage } from "@/contexts/LanguageContext";

const LoadingState = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-fitness-accent-600" />
          {t?.('shoppingList.title') || 'Shopping List'}
        </SheetTitle>
      </SheetHeader>
      
      <div className="flex items-center justify-center py-12">
        <EnhancedLoadingIndicator
          status="loading"
          type="general"
          message="Loading shopping list..."
          description="Preparing your grocery items"
          variant="card"
          size="lg"
          showSteps={true}
          customSteps={[
            "Processing meal ingredients",
            "Grouping by categories",
            "Calculating quantities"
          ]}
        />
      </div>
    </div>
  );
};

export default LoadingState;

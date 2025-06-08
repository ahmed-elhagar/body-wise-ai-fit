
import React from "react";
import SimpleLoadingIndicator from "@/components/ui/simple-loading-indicator";
import { useI18n } from "@/hooks/useI18n";

const LoadingState = React.memo(() => {
  const { isRTL } = useI18n();

  return (
    <div className="bg-white rounded-lg border-fitness-primary-200 shadow-lg p-6">
      <SimpleLoadingIndicator
        message={isRTL ? 'جاري تحضير قائمة التسوق...' : 'Preparing shopping list...'}
        description="Organizing ingredients from your meal plan"
        size="lg"
        className="bg-white border-fitness-primary-200 text-fitness-primary-600"
      />
    </div>
  );
});

LoadingState.displayName = 'LoadingState';

export default LoadingState;

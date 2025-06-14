
import React from 'react';
import { Loader2 } from 'lucide-react';

interface MealPlanLoadingOverlayProps {
  isVisible: boolean;
}

const MealPlanLoadingOverlay = ({ isVisible }: MealPlanLoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg min-h-[400px]">
      <div className="flex flex-col items-center gap-3 bg-white rounded-lg shadow-lg p-6 border">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
        <p className="text-sm text-gray-700 font-medium">Loading meals...</p>
        <p className="text-xs text-gray-500">Please wait while we fetch your meal plan</p>
      </div>
    </div>
  );
};

export default MealPlanLoadingOverlay;

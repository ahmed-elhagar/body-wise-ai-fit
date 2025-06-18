
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";

interface ShoppingListProgressProps {
  progress: number;
  checkedCount: number;
  totalItems: number;
  remainingItems: number;
}

export const ShoppingListProgress = ({
  progress,
  checkedCount,
  totalItems,
  remainingItems
}: ShoppingListProgressProps) => {
  return (
    <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 border-b">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-violet-600" />
          <span className="text-sm font-medium text-violet-900">
            Progress: {Math.round(progress)}%
          </span>
        </div>
        <span className="text-xs text-violet-700">
          {checkedCount}/{totalItems} completed
        </span>
      </div>
      
      <Progress 
        value={progress} 
        className="h-2 bg-white/50"
      />
      
      {remainingItems > 0 && (
        <p className="text-xs text-violet-600 mt-2">
          {remainingItems} items remaining
        </p>
      )}
    </div>
  );
};

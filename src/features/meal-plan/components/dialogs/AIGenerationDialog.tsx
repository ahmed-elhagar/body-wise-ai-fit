
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import type { MealPlanPreferences } from '@/types/mealPlan';

interface AIGenerationDialogProps {
  open: boolean;
  onClose: () => void;
  preferences: MealPlanPreferences;
  onPreferencesChange: (preferences: MealPlanPreferences) => void;
  onGenerate: () => Promise<boolean>;
  isGenerating: boolean;
  userCredits: number;
  hasExistingPlan: boolean;
}

export const AIGenerationDialog = ({
  open,
  onClose,
  preferences,
  onPreferencesChange,
  onGenerate,
  isGenerating,
  userCredits,
  hasExistingPlan
}: AIGenerationDialogProps) => {
  const handleGenerate = async () => {
    const success = await onGenerate();
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Generate AI Meal Plan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Credits available: {userCredits}
          </div>
          
          {hasExistingPlan && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                This will replace your existing meal plan for this week.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || userCredits <= 0}
              className="flex-1"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

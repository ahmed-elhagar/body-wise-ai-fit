
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { CalorieProgressCard } from './add-snack/CalorieProgressCard';
import { SnackGenerationSection } from './add-snack/SnackGenerationSection';
import { TargetReachedState } from './add-snack/TargetReachedState';

interface AddSnackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDayCalories: number;
  targetDayCalories: number;
}

const AddSnackDialog = ({ open, onOpenChange, currentDayCalories, targetDayCalories }: AddSnackDialogProps) => {
  const { t } = useI18n();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSnack, setGeneratedSnack] = useState(null);
  
  const remainingCalories = targetDayCalories - currentDayCalories;
  const hasReachedTarget = remainingCalories <= 0;

  const handleGenerateSnack = async () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedSnack({
        name: "Mixed Nuts",
        calories: Math.min(remainingCalories, 200),
        protein: 8,
        carbs: 6,
        fat: 14
      });
      setIsGenerating(false);
    }, 2000);
  };

  const handleAddSnack = async () => {
    // Add snack logic here
    setGeneratedSnack(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {t('addSnack.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <CalorieProgressCard
            currentDayCalories={currentDayCalories}
            targetDayCalories={targetDayCalories}
          />

          {hasReachedTarget ? (
            <TargetReachedState
              onCancel={() => onOpenChange(false)}
            />
          ) : (
            <SnackGenerationSection
              remainingCalories={remainingCalories}
              isGenerating={isGenerating}
              generatedSnack={generatedSnack}
              onGenerateSnack={handleGenerateSnack}
              onAddSnack={handleAddSnack}
              onCancel={() => onOpenChange(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSnackDialog;

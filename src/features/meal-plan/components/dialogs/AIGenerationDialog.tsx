
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import type { MealPlanPreferences } from '../../types';

interface AIGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: MealPlanPreferences;
  setPreferences: (preferences: MealPlanPreferences) => void;
  weekOffset: number;
  onSuccess: () => void;
}

export const AIGenerationDialog = ({
  isOpen,
  onClose,
  preferences,
  setPreferences,
  weekOffset,
  onSuccess
}: AIGenerationDialogProps) => {
  
  const handleGenerate = async () => {
    // TODO: Implement AI generation logic
    console.log('Generating AI meal plan with preferences:', preferences);
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Generate AI Meal Plan
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-gray-600">
            Generate a personalized meal plan based on your preferences and goals.
          </p>
          
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleGenerate} className="flex-1">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

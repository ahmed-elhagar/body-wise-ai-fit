
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';

interface AIGenerationDialogProps {
  open: boolean;
  onClose: () => void;
  preferences: any;
  onPreferencesChange: (preferences: any) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasExistingPlan: boolean;
}

const AIGenerationDialog = ({
  open,
  onClose,
  preferences,
  onPreferencesChange,
  onGenerate,
  isGenerating,
  hasExistingPlan
}: AIGenerationDialogProps) => {
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {hasExistingPlan 
              ? t('mealPlan:regeneratePlan') || 'Regenerate Meal Plan'
              : t('mealPlan:generatePlan') || 'Generate AI Meal Plan'
            }
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            {t('mealPlan:aiGenerationDescription') || 'Generate a personalized meal plan based on your preferences and goals.'}
          </p>
          
          <Button 
            onClick={onGenerate} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating 
              ? t('common:generating') || 'Generating...'
              : hasExistingPlan 
                ? t('mealPlan:regenerate') || 'Regenerate Plan'
                : t('mealPlan:generate') || 'Generate Plan'
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerationDialog;

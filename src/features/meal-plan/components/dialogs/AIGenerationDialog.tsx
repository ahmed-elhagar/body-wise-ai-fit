
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Sparkles, AlertCircle } from "lucide-react";
import { useMealPlanTranslations } from '@/utils/mealPlanTranslations';
import { useCreditSystem } from '@/hooks/useCreditSystem';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import type { MealPlanPreferences } from '../../types';

interface AIGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: MealPlanPreferences;
  onGenerate: () => Promise<boolean>;
  isGenerating: boolean;
  weekOffset: number;
}

export const AIGenerationDialog = ({
  isOpen,
  onClose,
  preferences,
  onGenerate,
  isGenerating,
  weekOffset
}: AIGenerationDialogProps) => {
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  const {
    generateAIMealPlan,
    analyzing,
    creating,
    saving,
    failed,
    language
  } = useMealPlanTranslations();
  
  const { userCredits } = useCreditSystem();

  const steps = [analyzing, creating, saving];

  const handleGenerate = async () => {
    if (userCredits <= 0) {
      setError('No AI credits remaining');
      return;
    }

    setError(null);
    setCurrentStep(0);

    try {
      // Simulate step progression
      setTimeout(() => setCurrentStep(1), 2000);
      setTimeout(() => setCurrentStep(2), 4000);

      const success = await onGenerate();
      if (success) {
        onClose();
      }
    } catch (err: any) {
      console.error('❌ Failed to generate meal plan:', err);
      setError(err.message || failed);
    } finally {
      setCurrentStep(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {generateAIMealPlan}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Generation Progress */}
          {isGenerating && (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-sm font-medium">{steps[currentStep]}</span>
              </div>
              <Progress value={((currentStep + 1) / steps.length) * 100} />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}
          
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate} 
              className="flex-1"
              disabled={isGenerating || userCredits <= 0}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {generateAIMealPlan}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

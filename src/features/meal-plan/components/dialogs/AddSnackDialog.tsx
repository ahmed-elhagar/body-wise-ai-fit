
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { useMealPlanTranslations } from '@/utils/mealPlanTranslations';
import { useCreditSystem } from '@/hooks/useCreditSystem';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import type { AddSnackDialogProps } from '../../types';

export const AddSnackDialog = ({
  isOpen,
  onClose,
  selectedDay,
  weeklyPlanId,
  onSnackAdded,
  currentDayCalories,
  targetDayCalories
}: AddSnackDialogProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  const {
    addSnack,
    generateAISnack,
    analyzing,
    creating,
    saving,
    calAvailable,
    notEnoughCalories,
    failed,
    snackAddedSuccess,
    targetReached,
    excellentProgress,
    language
  } = useMealPlanTranslations();
  
  const { userCredits } = useCreditSystem();
  const { user } = useAuth();
  const { profile } = useProfile();

  const remainingCalories = Math.max(0, targetDayCalories - currentDayCalories);
  const isTargetReached = currentDayCalories >= targetDayCalories;

  const steps = [analyzing, creating, saving];

  const handleGenerateSnack = async () => {
    if (!user?.id || !profile || !weeklyPlanId) {
      setError('Missing required data');
      return;
    }

    if (remainingCalories < 50) {
      setError(notEnoughCalories);
      return;
    }

    if (userCredits <= 0) {
      setError('No AI credits remaining');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentStep(0);

    try {
      // Simulate step progression
      setTimeout(() => setCurrentStep(1), 1000);
      setTimeout(() => setCurrentStep(2), 2000);

      const { data, error: functionError } = await supabase.functions.invoke('generate-snack', {
        body: {
          userProfile: {
            ...profile,
            id: user.id
          },
          weeklyPlanId,
          dayNumber: selectedDay,
          remainingCalories,
          language
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data?.success) {
        throw new Error(data?.error || failed);
      }

      console.log('✅ Snack generated successfully:', data);
      onSnackAdded();
      onClose();
      
    } catch (err: any) {
      console.error('❌ Failed to generate snack:', err);
      setError(err.message || failed);
    } finally {
      setIsGenerating(false);
      setCurrentStep(0);
    }
  };

  if (isTargetReached) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              {targetReached}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 text-center">
            <p className="text-gray-600">{excellentProgress}</p>
            
            <Button onClick={onClose} className="w-full">
              Perfect!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {addSnack}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Calorie Progress */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Daily Progress</span>
              <span className="text-sm text-gray-600">
                {currentDayCalories}/{targetDayCalories} cal
              </span>
            </div>
            <Progress 
              value={(currentDayCalories / targetDayCalories) * 100} 
              className="h-2"
            />
            <p className="text-sm text-gray-600 mt-2">
              {remainingCalories} {calAvailable}
            </p>
          </div>

          {/* AI Generation Section */}
          <div className="space-y-4">
            <div className="text-center">
              <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">{generateAISnack}</h3>
              <p className="text-gray-600">
                Our AI will create a personalized snack that fits your remaining calories and preferences
              </p>
            </div>

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
          </div>

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
              onClick={handleGenerateSnack} 
              className="flex-1"
              disabled={isGenerating || userCredits <= 0 || remainingCalories < 50}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {generateAISnack}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

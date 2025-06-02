
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Sparkles, AlertCircle, CheckCircle } from "lucide-react";
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
  setPreferences: (prefs: MealPlanPreferences) => void;
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  const {
    generateAIMealPlan,
    analyzing,
    creating,
    saving,
    failed,
    planGeneratedSuccess,
    language
  } = useMealPlanTranslations();
  
  const { userCredits } = useCreditSystem();
  const { user } = useAuth();
  const { profile } = useProfile();

  const steps = [analyzing, creating, saving];

  const handleGenerate = async () => {
    if (!user?.id || !profile) {
      setError('User authentication required');
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
      setTimeout(() => setCurrentStep(1), 2000);
      setTimeout(() => setCurrentStep(2), 4000);

      // Use existing generate-meal-plan function
      const { data, error: functionError } = await supabase.functions.invoke('generate-meal-plan', {
        body: {
          userProfile: {
            ...profile,
            id: user.id
          },
          preferences: {
            ...preferences,
            weekOffset,
            language
          }
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data?.success) {
        throw new Error(data?.error || failed);
      }

      console.log('✅ Meal plan generated successfully:', data);
      onSuccess();
      onClose();
      
    } catch (err: any) {
      console.error('❌ Failed to generate meal plan:', err);
      setError(err.message || failed);
    } finally {
      setIsGenerating(false);
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
          {/* Preferences Form */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duration (Days)</Label>
              <Select 
                value={preferences.duration} 
                onValueChange={(value) => setPreferences({...preferences, duration: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="14">14 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cuisine Type</Label>
              <Select 
                value={preferences.cuisine} 
                onValueChange={(value) => setPreferences({...preferences, cuisine: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="middleEastern">Middle Eastern</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Max Prep Time (minutes)</Label>
              <Select 
                value={preferences.maxPrepTime} 
                onValueChange={(value) => setPreferences({...preferences, maxPrepTime: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Meal Types</Label>
              <Select 
                value={preferences.mealTypes} 
                onValueChange={(value) => setPreferences({...preferences, mealTypes: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast,lunch,dinner">Main Meals Only</SelectItem>
                  <SelectItem value="breakfast,lunch,dinner,snack1,snack2">With Snacks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={preferences.includeSnacks}
              onCheckedChange={(checked) => setPreferences({...preferences, includeSnacks: checked})}
            />
            <Label>Include healthy snacks</Label>
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

          {/* Success/Error Display */}
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

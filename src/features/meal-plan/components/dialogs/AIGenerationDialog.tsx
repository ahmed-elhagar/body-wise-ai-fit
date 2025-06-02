
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles, AlertTriangle } from "lucide-react";
import { useMealPlanTranslations } from '@/utils/mealPlanTranslations';
import { useCreditSystem } from '@/hooks/useCreditSystem';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { getWeekStartDate } from '@/utils/mealPlanUtils';
import { format } from 'date-fns';
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    generateAIMealPlan, 
    aiCredits, 
    noCreditsRemaining,
    language 
  } = useMealPlanTranslations();
  
  const { userCredits } = useCreditSystem();
  const { user } = useAuth();
  const { profile } = useProfile();

  const handleGenerate = async () => {
    if (!user?.id || !profile) {
      setError('User authentication required');
      return;
    }

    if (userCredits <= 0) {
      setError(noCreditsRemaining);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const weekStartDate = getWeekStartDate(weekOffset);
      const weekStartDateStr = format(weekStartDate, 'yyyy-MM-dd');

      const { data, error: functionError } = await supabase.functions.invoke('generate-meal-plan', {
        body: {
          userProfile: {
            ...profile,
            id: user.id
          },
          preferences: {
            ...preferences,
            language,
            weekOffset,
            weekStartDate: weekStartDateStr
          }
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to generate meal plan');
      }

      console.log('✅ Meal plan generated successfully:', data);
      onSuccess();
      onClose();
      
    } catch (err: any) {
      console.error('❌ Failed to generate meal plan:', err);
      setError(err.message || 'Failed to generate meal plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const updatePreference = (key: keyof MealPlanPreferences, value: any) => {
    setPreferences({
      ...preferences,
      [key]: value
    });
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
          {/* Credits Warning */}
          {userCredits <= 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">{noCreditsRemaining}</p>
              </div>
            </div>
          )}

          {/* Credits Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{aiCredits}</span>
              <span className="text-2xl font-bold text-blue-600">{userCredits}</span>
            </div>
          </div>

          {/* Preferences Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cuisine">Cuisine Type</Label>
              <Select value={preferences.cuisine} onValueChange={(value) => updatePreference('cuisine', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="middle_eastern">Middle Eastern</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="maxPrepTime">Max Prep Time</Label>
              <Select value={preferences.maxPrepTime} onValueChange={(value) => updatePreference('maxPrepTime', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select prep time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2+ hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="includeSnacks"
              checked={preferences.includeSnacks}
              onCheckedChange={(checked) => updatePreference('includeSnacks', checked)}
            />
            <Label htmlFor="includeSnacks">Include snacks in meal plan</Label>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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

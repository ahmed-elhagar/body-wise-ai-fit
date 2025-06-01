import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ChefHat } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import EnhancedLoadingIndicator from "@/components/ui/enhanced-loading-indicator";

interface AIGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: any;
  onPreferencesChange: (preferences: any) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const AIGenerationDialog = ({ isOpen, onClose, preferences, onPreferencesChange, onGenerate, isGenerating }: AIGenerationDialogProps) => {
  const { t, isRTL } = useI18n();

  const handlePreferenceChange = (field: string, value: any) => {
    onPreferencesChange({ ...preferences, [field]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-800">
                {t('mealPlan.aiGeneration.title')}
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                {t('mealPlan.aiGeneration.description')}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="dietary-preferences" className="text-sm font-medium">
              {t('mealPlan.aiGeneration.dietaryPreferences')}
            </Label>
            <Textarea
              id="dietary-preferences"
              placeholder={t('mealPlan.aiGeneration.dietaryPreferencesPlaceholder')}
              className="mt-1"
              value={preferences.dietaryPreferences || ''}
              onChange={(e) => handlePreferenceChange('dietaryPreferences', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="food-allergies" className="text-sm font-medium">
              {t('mealPlan.aiGeneration.foodAllergies')}
            </Label>
            <Textarea
              id="food-allergies"
              placeholder={t('mealPlan.aiGeneration.foodAllergiesPlaceholder')}
              className="mt-1"
              value={preferences.foodAllergies || ''}
              onChange={(e) => handlePreferenceChange('foodAllergies', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="calorie-target" className="text-sm font-medium">
              {t('mealPlan.aiGeneration.calorieTarget')}
            </Label>
            <input
              type="number"
              id="calorie-target"
              placeholder={t('mealPlan.aiGeneration.calorieTargetPlaceholder')}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              value={preferences.calorieTarget || ''}
              onChange={(e) => handlePreferenceChange('calorieTarget', e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="mr-2"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <EnhancedLoadingIndicator
                  status="loading"
                  type="general"
                  message={t('mealPlan.aiGeneration.generating')}
                  description={t('mealPlan.aiGeneration.generatingDescription')}
                  variant="inline"
                  size="sm"
                />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {t('mealPlan.aiGeneration.generate')}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerationDialog;

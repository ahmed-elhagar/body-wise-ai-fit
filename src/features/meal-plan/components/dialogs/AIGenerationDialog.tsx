
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertCircle, Clock, Heart, Baby, Moon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCreditSystem } from '@/hooks/useCreditSystem';
import { useLifePhaseProfile } from '@/hooks/useLifePhaseProfile';
import EnhancedLoadingIndicator from '@/components/ui/enhanced-loading-indicator';
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
  const [localPreferences, setLocalPreferences] = React.useState(preferences);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  
  const { t, isRTL, language } = useLanguage();
  const { userCredits } = useCreditSystem();
  const { getNutritionContext } = useLifePhaseProfile();
  
  const nutritionContext = getNutritionContext();

  const steps = [
    t('mealPlan.generation.analyzing') || 'Analyzing preferences...',
    t('mealPlan.generation.creating') || 'Creating meal combinations...',
    t('mealPlan.generation.optimizing') || 'Optimizing nutrition...',
    t('mealPlan.generation.finalizing') || 'Finalizing your plan...'
  ];

  React.useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  React.useEffect(() => {
    if (isGenerating) {
      setCurrentStep(0);
      const interval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % steps.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isGenerating, steps.length]);

  const handlePreferenceChange = (key: string, value: any) => {
    setLocalPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (userCredits <= 0) {
      setError(t('mealPlan.errors.noCredits') || 'No AI credits remaining');
      return;
    }

    setError(null);
    setCurrentStep(0);

    try {
      const success = await onGenerate();
      if (success) {
        onClose();
      } else {
        setError(t('mealPlan.errors.generationFailed') || 'Generation failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate meal plan');
    }
  };

  const getLifePhaseIcon = () => {
    if (nutritionContext.pregnancyTrimester) return <Baby className="w-4 h-4" />;
    if (nutritionContext.breastfeedingLevel) return <Heart className="w-4 h-4" />;
    if (nutritionContext.isMuslimFasting) return <Moon className="w-4 h-4" />;
    return null;
  };

  const getLifePhaseLabel = () => {
    if (nutritionContext.pregnancyTrimester) {
      return `${t('profile.lifePhase.pregnancy.title')} - ${t('profile.lifePhase.pregnancy.trimester' + nutritionContext.pregnancyTrimester)}`;
    }
    if (nutritionContext.breastfeedingLevel) {
      return `${t('profile.lifePhase.breastfeeding.title')} - ${t('profile.lifePhase.breastfeeding.' + nutritionContext.breastfeedingLevel)}`;
    }
    if (nutritionContext.isMuslimFasting) {
      return language === 'ar' ? 'الصيام الإسلامي' : 'Muslim Fasting';
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Sparkles className="w-5 h-5 text-blue-600" />
            {t('mealPlan.generateAIMealPlan') || 'Generate AI Meal Plan'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Credits Display */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {t('mealPlan.creditsRemaining') || 'Credits remaining'}
              </span>
            </div>
            <Badge variant={userCredits > 0 ? "default" : "destructive"}>
              {userCredits}
            </Badge>
          </div>

          {/* Special Conditions */}
          {(nutritionContext.pregnancyTrimester || nutritionContext.breastfeedingLevel || nutritionContext.isMuslimFasting) && (
            <div className="bg-health-soft border border-health-border rounded-lg p-4">
              <Label className="text-sm font-medium text-health-text-primary mb-2 block">
                {language === 'ar' ? 'الحالة الخاصة' : 'Special Condition'}
              </Label>
              <Badge 
                variant="secondary" 
                className={`bg-gradient-to-r from-health-primary/10 to-health-secondary/10 text-health-primary border-health-primary/20 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {getLifePhaseIcon()}
                <span className={isRTL ? 'mr-2' : 'ml-2'}>{getLifePhaseLabel()}</span>
              </Badge>
              {nutritionContext.extraCalories > 0 && (
                <p className="text-xs text-health-text-secondary mt-2">
                  +{nutritionContext.extraCalories} {language === 'ar' ? 'سعرة حرارية/يوم' : 'kcal/day'}
                </p>
              )}
            </div>
          )}

          {/* Generation Progress */}
          {isGenerating && (
            <EnhancedLoadingIndicator
              status="loading"
              type="meal-plan"
              message={steps[currentStep]}
              description={t('mealPlan.generation.pleaseWait') || 'Please wait while we create your plan'}
              variant="card"
              size="md"
              showSteps={true}
            />
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Preferences Form */}
          {!isGenerating && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cuisine">{t('mealPlan.mealPlanSettings.cuisine') || 'Cuisine'}</Label>
                <Select
                  value={localPreferences.cuisine || 'mixed'}
                  onValueChange={(value) => handlePreferenceChange('cuisine', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('mealPlan.selectCuisine') || 'Select cuisine'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mixed">{t('mixed') || 'Mixed'}</SelectItem>
                    <SelectItem value="mediterranean">{t('mealPlan.cuisine.mediterranean') || 'Mediterranean'}</SelectItem>
                    <SelectItem value="asian">{t('mealPlan.cuisine.asian') || 'Asian'}</SelectItem>
                    <SelectItem value="mexican">{t('mealPlan.cuisine.mexican') || 'Mexican'}</SelectItem>
                    <SelectItem value="italian">{t('mealPlan.cuisine.italian') || 'Italian'}</SelectItem>
                    <SelectItem value="middleEastern">{t('mealPlan.cuisine.middleEastern') || 'Middle Eastern'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="maxPrepTime">{t('mealPlan.maxPrepTime') || 'Max prep time'}</Label>
                <Select
                  value={localPreferences.maxPrepTime || '30'}
                  onValueChange={(value) => handlePreferenceChange('maxPrepTime', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 {t('minutes') || 'minutes'}</SelectItem>
                    <SelectItem value="45">45 {t('minutes') || 'minutes'}</SelectItem>
                    <SelectItem value="60">60 {t('minutes') || 'minutes'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Label htmlFor="includeSnacks">{t('mealPlan.mealPlanSettings.includeSnacks') || 'Include snacks'}</Label>
                <Switch
                  id="includeSnacks"
                  checked={localPreferences.includeSnacks !== false}
                  onCheckedChange={(checked) => handlePreferenceChange('includeSnacks', checked)}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button variant="outline" onClick={onClose} className="flex-1">
              {t('cancel') || 'Cancel'}
            </Button>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || userCredits <= 0}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  {t('generating') || 'Generating...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t('mealPlan.generateSevenDayPlan') || 'Generate Plan'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

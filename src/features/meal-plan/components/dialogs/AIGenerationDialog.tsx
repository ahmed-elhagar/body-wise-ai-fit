
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Loader2, Heart, Baby, Moon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLifePhaseProfile } from "@/hooks/useLifePhaseProfile";
import { Badge } from "@/components/ui/badge";

interface AIGenerationDialogProps {
  open: boolean;
  onClose: () => void;
  preferences: any;
  onPreferencesChange: (prefs: any) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasExistingPlan: boolean;
}

export const AIGenerationDialog = ({
  open,
  onClose,
  preferences,
  onPreferencesChange,
  onGenerate,
  isGenerating,
  hasExistingPlan
}: AIGenerationDialogProps) => {
  const { t = (key: string) => key, isRTL = false, language = 'en' } = useLanguage() || {};
  const { getNutritionContext } = useLifePhaseProfile() || { getNutritionContext: () => ({}) };
  
  const nutritionContext = getNutritionContext();

  const handlePreferenceChange = (key: string, value: any) => {
    onPreferencesChange({ [key]: value });
  };

  const getLifePhaseIcon = () => {
    if (nutritionContext.pregnancyTrimester) return <Baby className="w-4 h-4" />;
    if (nutritionContext.breastfeedingLevel) return <Heart className="w-4 h-4" />;
    if (nutritionContext.fastingType || nutritionContext.isMuslimFasting) return <Moon className="w-4 h-4" />;
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
    if (nutritionContext.fastingType) {
      return `${t('profile.lifePhase.fasting.title')} - ${t('profile.lifePhase.fasting.' + nutritionContext.fastingType)}`;
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Sparkles className="w-5 h-5 text-violet-600" />
            {hasExistingPlan ? 'Regenerate Meal Plan' : t('mealPlan.generateAIMealPlan') || 'Generate AI Meal Plan'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Special Conditions Indicator */}
          {(nutritionContext.pregnancyTrimester || nutritionContext.breastfeedingLevel || nutritionContext.fastingType || nutritionContext.isMuslimFasting) && (
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
                  +{nutritionContext.extraCalories} {language === 'ar' ? 'سعرة حرارية/يوم' : 'kcal/day'} - {language === 'ar' ? 'تعزيز التغذية' : 'Nutrition boost'}
                </p>
              )}
              {nutritionContext.isMuslimFasting && nutritionContext.fastingStartDate && nutritionContext.fastingEndDate && (
                <p className="text-xs text-blue-600 mt-1">
                  {language === 'ar' ? 'فترة الصيام:' : 'Fasting period:'} {nutritionContext.fastingStartDate} - {nutritionContext.fastingEndDate}
                </p>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="duration">Plan Duration</Label>
              <Select
                value={preferences.duration || "7"}
                onValueChange={(value) => handlePreferenceChange('duration', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cuisine">{t('mealPlan.mealPlanSettings.cuisine') || 'Cuisine Type'}</Label>
              <Select
                value={preferences.cuisine || 'mixed'}
                onValueChange={(value) => handlePreferenceChange('cuisine', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('mealPlan.leaveEmptyNationality') || 'Select cuisine'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">{t('mixed') || 'Mixed'}</SelectItem>
                  <SelectItem value="mediterranean">{t('mealPlan.cuisine.mediterranean') || 'Mediterranean'}</SelectItem>
                  <SelectItem value="asian">{t('mealPlan.cuisine.asian') || 'Asian'}</SelectItem>
                  <SelectItem value="mexican">{t('mealPlan.cuisine.mexican') || 'Mexican'}</SelectItem>
                  <SelectItem value="italian">{t('mealPlan.cuisine.italian') || 'Italian'}</SelectItem>
                  <SelectItem value="indian">{t('mealPlan.cuisine.indian') || 'Indian'}</SelectItem>
                  <SelectItem value="middleEastern">{t('mealPlan.cuisine.middleEastern') || 'Middle Eastern'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="maxPrepTime">{t('mealPlan.maxPrepTime') || 'Max Prep Time'}</Label>
              <Select
                value={preferences.maxPrepTime || '30'}
                onValueChange={(value) => handlePreferenceChange('maxPrepTime', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 {t('minutes') || 'minutes'}</SelectItem>
                  <SelectItem value="30">30 {t('minutes') || 'minutes'}</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label htmlFor="includeSnacks">{t('mealPlan.mealPlanSettings.includeSnacks') || 'Include snacks'}</Label>
              <Checkbox
                id="includeSnacks"
                checked={preferences.includeSnacks !== false}
                onCheckedChange={(checked) => handlePreferenceChange('includeSnacks', checked)}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {hasExistingPlan ? 'Regenerate Plan' : (
                    nutritionContext.isMuslimFasting 
                      ? (language === 'ar' ? 'إنشاء خطة صيام' : 'Generate Fasting Plan')
                      : t('mealPlan.generateSevenDayPlan') || 'Generate 7-Day Plan'
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

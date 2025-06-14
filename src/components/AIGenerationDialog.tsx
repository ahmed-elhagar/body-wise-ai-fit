
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Heart, Baby, Moon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { useLifePhaseProfile } from "@/hooks/useLifePhaseProfile";
import { Badge } from "@/components/ui/badge";

interface AIGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: any;
  onPreferencesChange: (preferences: any) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const AIGenerationDialog = ({
  isOpen,
  onClose,
  preferences,
  onPreferencesChange,
  onGenerate,
  isGenerating
}: AIGenerationDialogProps) => {
  const { t, isRTL, language } = useLanguage();
  const { flags } = useFeatureFlags();
  const { getNutritionContext } = useLifePhaseProfile();
  
  const nutritionContext = getNutritionContext();

  const handlePreferenceChange = (key: string, value: any) => {
    onPreferencesChange({ ...preferences, [key]: value });
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Sparkles className="w-5 h-5 text-blue-600" />
            {t('mealPlan.generateAIMealPlan')}
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
              <Label htmlFor="cuisine">{t('mealPlan.mealPlanSettings.cuisine')}</Label>
              <Select
                value={preferences.cuisine || 'mixed'}
                onValueChange={(value) => handlePreferenceChange('cuisine', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('mealPlan.leaveEmptyNationality')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">{t('mixed')}</SelectItem>
                  <SelectItem value="mediterranean">{t('mealPlan.cuisine.mediterranean')}</SelectItem>
                  <SelectItem value="asian">{t('mealPlan.cuisine.asian')}</SelectItem>
                  <SelectItem value="mexican">{t('mealPlan.cuisine.mexican')}</SelectItem>
                  <SelectItem value="italian">{t('mealPlan.cuisine.italian')}</SelectItem>
                  <SelectItem value="indian">{t('mealPlan.cuisine.indian')}</SelectItem>
                  <SelectItem value="middleEastern">{t('mealPlan.cuisine.middleEastern')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="maxPrepTime">{t('mealPlan.maxPrepTime')}</Label>
              <Select
                value={preferences.maxPrepTime || '30'}
                onValueChange={(value) => handlePreferenceChange('maxPrepTime', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 {t('minutes')}</SelectItem>
                  <SelectItem value="45">45 {t('minutes')}</SelectItem>
                  <SelectItem value="60">60 {t('minutes')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label htmlFor="includeSnacks">{t('mealPlan.mealPlanSettings.includeSnacks')}</Label>
              <Switch
                id="includeSnacks"
                checked={preferences.includeSnacks !== false}
                onCheckedChange={(checked) => handlePreferenceChange('includeSnacks', checked)}
              />
            </div>
          </div>

          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button variant="outline" onClick={onClose} className="flex-1">
              {t('cancel')}
            </Button>
            <Button 
              onClick={onGenerate} 
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  {t('generating')}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {nutritionContext.isMuslimFasting 
                    ? (language === 'ar' ? 'إنشاء خطة صيام' : 'Generate Fasting Plan')
                    : t('mealPlan.generateSevenDayPlan')
                  }
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerationDialog;

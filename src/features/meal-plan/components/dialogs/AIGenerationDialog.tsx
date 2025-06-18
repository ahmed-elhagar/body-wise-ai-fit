
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Loader2, Heart, Baby, Moon, Zap, Clock, ChefHat } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLifePhaseProfile } from "@/hooks/useLifePhaseProfile";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
  const { nutritionContext } = useLifePhaseProfile();

  const handlePreferenceChange = (key: string, value: any) => {
    onPreferencesChange({ [key]: value });
  };

  const getLifePhaseIcon = () => {
    if (nutritionContext.pregnancyTrimester) return <Baby className="w-4 h-4 text-pink-600" />;
    if (nutritionContext.breastfeedingLevel) return <Heart className="w-4 h-4 text-rose-600" />;
    if (nutritionContext.fastingType || nutritionContext.isMuslimFasting) return <Moon className="w-4 h-4 text-blue-600" />;
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

  const hasSpecialConditions = nutritionContext.pregnancyTrimester || 
                              nutritionContext.breastfeedingLevel || 
                              nutritionContext.fastingType || 
                              nutritionContext.isMuslimFasting;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                {hasExistingPlan ? 'Regenerate Meal Plan' : t('mealPlan.generateAIMealPlan') || 'Generate AI Meal Plan'}
              </span>
              <span className="text-sm text-gray-500 font-normal">
                {language === 'ar' ? 'خطة مخصصة بالذكاء الاصطناعي' : 'AI-powered personalized nutrition'}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Special Conditions Card */}
          {hasSpecialConditions && (
            <Card className="border-2 border-gradient-to-r from-pink-200 to-purple-200 bg-gradient-to-r from-pink-50/50 to-purple-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <Label className="text-sm font-semibold text-purple-800">
                    {language === 'ar' ? 'الحالة الخاصة المكتشفة' : 'Special Condition Detected'}
                  </Label>
                </div>
                
                <Badge 
                  variant="secondary" 
                  className={`bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 px-3 py-1 ${isRTL ? 'flex-row-reverse' : ''} flex items-center gap-2`}
                >
                  {getLifePhaseIcon()}
                  <span className="font-medium">{getLifePhaseLabel()}</span>
                </Badge>
                
                {nutritionContext.extraCalories > 0 && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-700 font-medium">
                        +{nutritionContext.extraCalories} {language === 'ar' ? 'سعرة حرارية إضافية يومياً' : 'extra kcal/day'}
                      </span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      {language === 'ar' ? 'تم تعديل السعرات تلقائياً لحالتك الخاصة' : 'Calories automatically adjusted for your condition'}
                    </p>
                  </div>
                )}
                
                {nutritionContext.isMuslimFasting && nutritionContext.fastingStartDate && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-xs text-blue-700">
                      <Moon className="w-3 h-3 inline mr-1" />
                      {language === 'ar' ? 'سيتم تصميم الوجبات لتناسب أوقات الصيام' : 'Meals will be designed around fasting schedule'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Plan Configuration */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Clock className="w-4 h-4 text-blue-600" />
                Plan Duration
              </Label>
              <Select
                value={preferences.duration || "7"}
                onValueChange={(value) => handlePreferenceChange('duration', value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">
                    <div className="flex items-center gap-2">
                      <span>7 days</span>
                      <Badge variant="secondary" className="text-xs">Recommended</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <ChefHat className="w-4 h-4 text-green-600" />
                {t('mealPlan.mealPlanSettings.cuisine') || 'Cuisine Type'}
              </Label>
              <Select
                value={preferences.cuisine || 'mixed'}
                onValueChange={(value) => handlePreferenceChange('cuisine', value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={t('mealPlan.leaveEmptyNationality') || 'Select cuisine'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">{t('mixed') || 'Mixed International'}</SelectItem>
                  <SelectItem value="mediterranean">{t('mealPlan.cuisine.mediterranean') || 'Mediterranean'}</SelectItem>
                  <SelectItem value="asian">{t('mealPlan.cuisine.asian') || 'Asian'}</SelectItem>
                  <SelectItem value="mexican">{t('mealPlan.cuisine.mexican') || 'Mexican'}</SelectItem>
                  <SelectItem value="italian">{t('mealPlan.cuisine.italian') || 'Italian'}</SelectItem>
                  <SelectItem value="indian">{t('mealPlan.cuisine.indian') || 'Indian'}</SelectItem>
                  <SelectItem value="middleEastern">{t('mealPlan.cuisine.middleEastern') || 'Middle Eastern'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Clock className="w-4 h-4 text-orange-600" />
                {t('mealPlan.maxPrepTime') || 'Max Prep Time'}
              </Label>
              <Select
                value={preferences.maxPrepTime || '30'}
                onValueChange={(value) => handlePreferenceChange('maxPrepTime', value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 {t('minutes') || 'minutes'}</SelectItem>
                  <SelectItem value="30">30 {t('minutes') || 'minutes'}</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <Label htmlFor="includeSnacks" className="text-sm font-medium">
                  {t('mealPlan.mealPlanSettings.includeSnacks') || 'Include healthy snacks'}
                </Label>
              </div>
              <Checkbox
                id="includeSnacks"
                checked={preferences.includeSnacks !== false}
                onCheckedChange={(checked) => handlePreferenceChange('includeSnacks', checked)}
                className="border-purple-300 data-[state=checked]:bg-purple-600"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 h-12"
              disabled={isGenerating}
            >
              {t('cancel') || 'Cancel'}
            </Button>
            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              className="flex-1 h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {language === 'ar' ? 'جاري الإنشاء...' : 'Generating...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {hasExistingPlan ? 'Regenerate Plan' : (
                    nutritionContext.isMuslimFasting 
                      ? (language === 'ar' ? 'إنشاء خطة صيام' : 'Generate Fasting Plan')
                      : (language === 'ar' ? 'إنشاء خطة 7 أيام' : 'Generate 7-Day Plan')
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

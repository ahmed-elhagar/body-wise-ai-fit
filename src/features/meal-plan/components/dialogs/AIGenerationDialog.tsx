
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Sparkles, 
  Loader2, 
  Heart, 
  Baby, 
  Moon, 
  Zap, 
  Clock, 
  ChefHat,
  Utensils,
  Timer,
  Star,
  Palette
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLifePhaseProfile } from "@/hooks/useLifePhaseProfile";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      return language === 'ar' 
        ? `الحمل - الثلث ${nutritionContext.pregnancyTrimester}`
        : `Pregnancy - Trimester ${nutritionContext.pregnancyTrimester}`;
    }
    if (nutritionContext.breastfeedingLevel) {
      const level = nutritionContext.breastfeedingLevel === 'exclusive' 
        ? (language === 'ar' ? 'حصرية' : 'Exclusive')
        : (language === 'ar' ? 'جزئية' : 'Partial');
      return language === 'ar' ? `الرضاعة الطبيعية - ${level}` : `Breastfeeding - ${level}`;
    }
    if (nutritionContext.isMuslimFasting) {
      return language === 'ar' ? 'الصيام الإسلامي' : 'Muslim Fasting';
    }
    if (nutritionContext.fastingType) {
      return language === 'ar' ? 'الصيام المتقطع' : 'Intermittent Fasting';
    }
    return null;
  };

  const hasSpecialConditions = nutritionContext.pregnancyTrimester || 
                              nutritionContext.breastfeedingLevel || 
                              nutritionContext.fastingType || 
                              nutritionContext.isMuslimFasting;

  const headerTitle = hasExistingPlan 
    ? (language === 'ar' ? 'إعادة إنشاء خطة الوجبات' : 'Regenerate Meal Plan')
    : (language === 'ar' ? 'إنشاء خطة وجبات ذكية' : 'Generate Smart Meal Plan');

  const headerSubtitle = language === 'ar' 
    ? 'خطة مخصصة لمدة 7 أيام بالذكاء الاصطناعي'
    : '7-Day AI-Powered Personalized Plan';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-4 pb-2">
          <DialogTitle className={`flex items-center gap-4 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                {headerTitle}
              </span>
              <span className="text-sm text-gray-500 font-normal">
                {headerSubtitle}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Special Conditions Alert */}
          {hasSpecialConditions && (
            <Card className="border-2 border-gradient-to-r from-purple-200 to-pink-200 bg-gradient-to-r from-purple-50/80 to-pink-50/80 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                  <Label className="text-sm font-semibold text-purple-800">
                    {language === 'ar' ? 'حالة خاصة مكتشفة' : 'Special Condition Detected'}
                  </Label>
                </div>
                
                <Badge 
                  variant="secondary" 
                  className={`bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 px-3 py-1.5 ${isRTL ? 'flex-row-reverse' : ''} flex items-center gap-2 mb-3`}
                >
                  {getLifePhaseIcon()}
                  <span className="font-medium">{getLifePhaseLabel()}</span>
                </Badge>
                
                {nutritionContext.extraCalories > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">
                        +{nutritionContext.extraCalories} {language === 'ar' ? 'سعرة حرارية إضافية يومياً' : 'extra kcal/day'}
                      </span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      {language === 'ar' ? 'تم تعديل السعرات تلقائياً لحالتك الخاصة' : 'Calories automatically adjusted for your condition'}
                    </p>
                  </div>
                )}
                
                {nutritionContext.isMuslimFasting && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-700 font-medium">
                        {language === 'ar' ? 'سيتم تصميم الوجبات لتناسب أوقات الصيام' : 'Meals designed for fasting schedule'}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Meal Plan Configuration */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-gray-800">
                {language === 'ar' ? 'تخصيص خطة الوجبات' : 'Meal Plan Customization'}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {/* Cuisine Type */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <ChefHat className="w-4 h-4 text-orange-600" />
                  {language === 'ar' ? 'نوع المطبخ' : 'Cuisine Type'}
                </Label>
                <Select
                  value={preferences.cuisine || 'mixed'}
                  onValueChange={(value) => handlePreferenceChange('cuisine', value)}
                >
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-400 transition-colors">
                    <SelectValue placeholder={language === 'ar' ? 'اختر نوع المطبخ' : 'Select cuisine type'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mixed">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        <span>{language === 'ar' ? 'مختلط (عالمي)' : 'Mixed International'}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="mediterranean">{language === 'ar' ? 'متوسطي' : 'Mediterranean'}</SelectItem>
                    <SelectItem value="asian">{language === 'ar' ? 'آسيوي' : 'Asian'}</SelectItem>
                    <SelectItem value="mexican">{language === 'ar' ? 'مكسيكي' : 'Mexican'}</SelectItem>
                    <SelectItem value="italian">{language === 'ar' ? 'إيطالي' : 'Italian'}</SelectItem>
                    <SelectItem value="indian">{language === 'ar' ? 'هندي' : 'Indian'}</SelectItem>
                    <SelectItem value="middleEastern">{language === 'ar' ? 'شرق أوسطي' : 'Middle Eastern'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Max Prep Time */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Timer className="w-4 h-4 text-blue-600" />
                  {language === 'ar' ? 'وقت التحضير الأقصى' : 'Maximum Prep Time'}
                </Label>
                <Select
                  value={preferences.maxPrepTime || '30'}
                  onValueChange={(value) => handlePreferenceChange('maxPrepTime', value)}
                >
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-400 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span>15 {language === 'ar' ? 'دقيقة' : 'minutes'}</span>
                        <Badge variant="secondary" className="text-xs">
                          {language === 'ar' ? 'سريع' : 'Quick'}
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="30">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>30 {language === 'ar' ? 'دقيقة' : 'minutes'}</span>
                        <Badge variant="secondary" className="text-xs">
                          {language === 'ar' ? 'متوسط' : 'Moderate'}
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="60">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span>1 {language === 'ar' ? 'ساعة' : 'hour'}</span>
                        <Badge variant="secondary" className="text-xs">
                          {language === 'ar' ? 'تفصيلي' : 'Detailed'}
                        </Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Include Snacks Toggle */}
              <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <Utensils className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <Label htmlFor="includeSnacks" className="text-sm font-medium text-gray-700 cursor-pointer">
                      {language === 'ar' ? 'تضمين الوجبات الخفيفة الصحية' : 'Include healthy snacks'}
                    </Label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {language === 'ar' ? 'وجبات خفيفة مغذية بين الوجبات الرئيسية' : 'Nutritious snacks between main meals'}
                    </p>
                  </div>
                </div>
                <Checkbox
                  id="includeSnacks"
                  checked={preferences.includeSnacks !== false}
                  onCheckedChange={(checked) => handlePreferenceChange('includeSnacks', checked)}
                  className="border-purple-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 h-5 w-5"
                />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Action Buttons */}
          <div className={`flex gap-4 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 h-12 border-2 hover:bg-gray-50 transition-colors"
              disabled={isGenerating}
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              className="flex-1 h-12 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {language === 'ar' ? 'جاري الإنشاء...' : 'Generating...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  {hasExistingPlan ? (
                    language === 'ar' ? 'إعادة إنشاء الخطة' : 'Regenerate Plan'
                  ) : (
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

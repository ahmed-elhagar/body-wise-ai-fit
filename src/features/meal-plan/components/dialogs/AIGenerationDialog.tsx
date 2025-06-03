
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, AlertTriangle, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMealPlanTranslations } from '@/utils/mealPlanTranslations';
import type { MealPlanPreferences } from '@/types/mealPlan';

interface AIGenerationDialogProps {
  open: boolean;
  onClose: () => void;
  preferences: MealPlanPreferences;
  onPreferencesChange: (preferences: MealPlanPreferences) => void;
  onGenerate: () => Promise<boolean>;
  isGenerating: boolean;
  userCredits: number;
  hasExistingPlan: boolean;
}

export const AIGenerationDialog = ({
  open,
  onClose,
  preferences,
  onPreferencesChange,
  onGenerate,
  isGenerating,
  userCredits,
  hasExistingPlan
}: AIGenerationDialogProps) => {
  const { language } = useLanguage();
  const { 
    generateAIMealPlan,
    mealPlanSettings,
    includeSnacks,
    maxPrepTime,
    cuisine,
    aiCredits,
    creditsRemaining,
    generating,
    mealsPerDay,
    isRTL 
  } = useMealPlanTranslations();

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCuisineChange = (value: string) => {
    onPreferencesChange({
      ...preferences,
      cuisine: value
    });
  };

  const handleMaxPrepTimeChange = (value: string) => {
    onPreferencesChange({
      ...preferences,
      maxPrepTime: value
    });
  };

  const handleIncludeSnacksChange = (checked: boolean) => {
    onPreferencesChange({
      ...preferences,
      includeSnacks: checked
    });
  };

  const handleGenerate = async () => {
    if (hasExistingPlan) {
      setShowConfirmation(true);
      return;
    }
    
    const success = await onGenerate();
    if (success) {
      onClose();
      setShowConfirmation(false);
    }
  };

  const handleConfirmedGenerate = async () => {
    const success = await onGenerate();
    if (success) {
      onClose();
      setShowConfirmation(false);
    }
  };

  const getMealsPerDayText = () => {
    const count = preferences.includeSnacks ? 5 : 3;
    return language === 'ar' 
      ? `${count} وجبات يومياً`
      : `${count} meals per day`;
  };

  const getButtonText = () => {
    if (isGenerating) {
      return language === 'ar' ? 'جاري الإنشاء...' : 'Generating Your Plan...';
    }
    if (hasExistingPlan) {
      return language === 'ar' ? 'إعادة إنشاء الخطة' : 'Generate New Plan';
    }
    return language === 'ar' ? 'إنشاء خطة بالذكاء الاصطناعي' : 'Generate AI Meal Plan';
  };

  const cuisineOptions = [
    { value: 'mixed', label: language === 'ar' ? 'مختلط' : 'Mixed' },
    { value: 'mediterranean', label: language === 'ar' ? 'متوسطية' : 'Mediterranean' },
    { value: 'asian', label: language === 'ar' ? 'آسيوية' : 'Asian' },
    { value: 'mexican', label: language === 'ar' ? 'مكسيكية' : 'Mexican' },
    { value: 'italian', label: language === 'ar' ? 'إيطالية' : 'Italian' },
    { value: 'middle_eastern', label: language === 'ar' ? 'شرق أوسطية' : 'Middle Eastern' },
    { value: 'american', label: language === 'ar' ? 'أمريكية' : 'American' }
  ];

  if (showConfirmation) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className={`max-w-md ${isRTL ? 'text-right' : 'text-left'}`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              {language === 'ar' ? 'تأكيد إعادة الإنشاء' : 'Confirm Regeneration'}
            </DialogTitle>
            <DialogDescription>
              {language === 'ar' 
                ? 'ستستبدل هذه العملية خطة الوجبات الحالية وستستهلك رصيد ذكاء اصطناعي واحد.'
                : 'This will replace your current meal plan and consume 1 AI credit.'
              }
            </DialogDescription>
          </DialogHeader>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {language === 'ar' ? 'الأرصدة المتبقية:' : 'Credits Remaining:'}
                </span>
                <Badge variant="outline" className="bg-white">
                  <Zap className="w-3 h-3 mr-1" />
                  {userCredits}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmation(false)}
              className="flex-1"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleConfirmedGenerate}
              disabled={isGenerating || userCredits <= 0}
              className="flex-1"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'تأكيد الإنشاء' : 'Confirm Generate'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            {generateAIMealPlan || 'Generate AI Meal Plan'}
          </DialogTitle>
          <DialogDescription>
            {language === 'ar' 
              ? 'خصص خطة وجباتك باستخدام الذكاء الاصطناعي'
              : 'Customize your meal plan using AI'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Credits Display */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">
                    {aiCredits || 'AI Credits'}: {creditsRemaining || 'Remaining'}
                  </span>
                </div>
                <Badge variant="secondary" className="bg-white">
                  {userCredits}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Meal Configuration */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">
                {includeSnacks || 'Include Snacks'}
              </Label>
              <div className="flex items-center gap-3">
                <Switch
                  checked={preferences.includeSnacks}
                  onCheckedChange={handleIncludeSnacksChange}
                />
                <span className="text-sm text-gray-600">
                  {getMealsPerDayText()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-md">
                <Info className="w-3 h-3" />
                <span>
                  {language === 'ar' 
                    ? preferences.includeSnacks 
                      ? 'سيتم إنشاء 5 وجبات يومياً (فطار، وجبة خفيفة، غداء، وجبة خفيفة، عشاء)'
                      : 'سيتم إنشاء 3 وجبات يومياً (فطار، غداء، عشاء)'
                    : preferences.includeSnacks
                      ? 'Will generate 5 meals per day (breakfast, snack, lunch, snack, dinner)'
                      : 'Will generate 3 meals per day (breakfast, lunch, dinner)'
                  }
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cuisine">
                  {cuisine || 'Cuisine Type'}
                </Label>
                <Select
                  value={preferences.cuisine || 'mixed'}
                  onValueChange={handleCuisineChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cuisineOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPrepTime">
                  {maxPrepTime || 'Max Prep Time'} ({language === 'ar' ? 'دقيقة' : 'minutes'})
                </Label>
                <Select
                  value={preferences.maxPrepTime || '30'}
                  onValueChange={handleMaxPrepTimeChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 {language === 'ar' ? 'دقيقة' : 'minutes'}</SelectItem>
                    <SelectItem value="30">30 {language === 'ar' ? 'دقيقة' : 'minutes'}</SelectItem>
                    <SelectItem value="45">45 {language === 'ar' ? 'دقيقة' : 'minutes'}</SelectItem>
                    <SelectItem value="60">60 {language === 'ar' ? 'دقيقة' : 'minutes'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || userCredits <= 0}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {getButtonText()}
            </Button>
          </div>

          {userCredits <= 0 && (
            <div className="text-center text-red-600 text-sm">
              {language === 'ar' 
                ? 'لا توجد أرصدة ذكاء اصطناعي متبقية'
                : 'No AI credits remaining'
              }
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

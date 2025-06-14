import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, AlertTriangle, Info, Heart, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCentralizedCredits } from '@/hooks/useCentralizedCredits';
import { useProfile } from '@/hooks/useProfile';
import type { MealPlanPreferences } from '../../types';

interface AIGenerationDialogProps {
  open: boolean;
  onClose: () => void;
  preferences: MealPlanPreferences;
  onPreferencesChange: (preferences: MealPlanPreferences) => void;
  onGenerate: () => Promise<boolean>;
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
  const { t, isRTL } = useLanguage();
  const { profile } = useProfile();
  
  // Use centralized credits instead of passed props
  const { remaining: userCredits, isPro, hasCredits } = useCentralizedCredits();

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCuisineChange = (value: string) => {
    console.log('🔄 Cuisine changed to:', value);
    onPreferencesChange({
      ...preferences,
      cuisine: value
    });
  };

  const handleMaxPrepTimeChange = (value: string) => {
    console.log('🔄 Max prep time changed to:', value);
    onPreferencesChange({
      ...preferences,
      maxPrepTime: value
    });
  };

  const handleIncludeSnacksChange = (checked: boolean) => {
    console.log('🔄 Include snacks changed to:', checked);
    onPreferencesChange({
      ...preferences,
      includeSnacks: checked
    });
  };

  const handleGenerate = async () => {
    console.log('🚀 Generate button clicked, preferences:', preferences);
    
    if (hasExistingPlan) {
      setShowConfirmation(true);
      return;
    }
    
    const success = await onGenerate();
    if (success) {
      console.log('✅ Generation successful, closing dialog');
      onClose();
      setShowConfirmation(false);
    }
  };

  const handleConfirmedGenerate = async () => {
    console.log('🚀 Confirmed generate with preferences:', preferences);
    setShowConfirmation(false); // Close confirmation first
    
    const success = await onGenerate();
    if (success) {
      console.log('✅ Confirmed generation successful, closing main dialog');
      // Small delay to ensure generation process has started
      setTimeout(() => {
        onClose();
      }, 100);
    }
  };

  // Close dialog when generation starts (not when it completes)
  React.useEffect(() => {
    if (isGenerating && open) {
      console.log('🔄 Generation started, closing dialog');
      // Close dialog immediately when generation starts
      setTimeout(() => {
        onClose();
        setShowConfirmation(false);
      }, 500);
    }
  }, [isGenerating, open, onClose]);

  const getMealsPerDayText = () => {
    const count = preferences.includeSnacks ? 5 : 3;
    return isRTL 
      ? `${count} وجبات يومياً`
      : `${count} meals per day`;
  };

  const getButtonText = () => {
    if (isGenerating) {
      return isRTL ? 'جاري إنشاء خطتك...' : 'Creating Your Meal Plan...';
    }
    if (hasExistingPlan) {
      return isRTL ? 'إنشاء خطة جديدة' : 'Generate New Meal Plan';
    }
    return isRTL ? 'إنشاء خطة الوجبات بالذكاء الاصطناعي' : 'Generate AI Meal Plan';
  };

  const cuisineOptions = [
    { value: 'mixed', label: isRTL ? 'مختلط' : 'Mixed Cuisines' },
    { value: 'mediterranean', label: isRTL ? 'متوسطية' : 'Mediterranean' },
    { value: 'asian', label: isRTL ? 'آسيوية' : 'Asian' },
    { value: 'mexican', label: isRTL ? 'مكسيكية' : 'Mexican' },
    { value: 'italian', label: isRTL ? 'إيطالية' : 'Italian' },
    { value: 'middle_eastern', label: isRTL ? 'شرق أوسطية' : 'Middle Eastern' },
    { value: 'american', label: isRTL ? 'أمريكية' : 'American' }
  ];

  const displayCredits = isPro ? 'Unlimited' : `${userCredits}`;

  // Get health conditions from profile
  const healthConditions = profile?.health_conditions || [];
  const allergies = profile?.allergies || [];
  const dietaryRestrictions = profile?.dietary_restrictions || [];

  if (showConfirmation) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className={`max-w-md ${isRTL ? 'text-right' : 'text-left'}`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              {isRTL ? 'تأكيد إعادة الإنشاء' : 'Confirm Regeneration'}
            </DialogTitle>
            <DialogDescription>
              {isRTL 
                ? 'ستستبدل هذه العملية خطة الوجبات الحالية وستستهلك رصيد ذكاء اصطناعي واحد.'
                : 'This will replace your current meal plan and consume 1 AI credit.'
              }
            </DialogDescription>
          </DialogHeader>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {isRTL ? 'الأرصدة المتبقية:' : 'Credits Remaining:'}
                </span>
                <Badge variant="outline" className="bg-white">
                  <Zap className="w-3 h-3 mr-1" />
                  {displayCredits}
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
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleConfirmedGenerate}
              disabled={isGenerating || !hasCredits}
              className="flex-1"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isRTL ? 'تأكيد الإنشاء' : 'Confirm Generate'}
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
            {t('Generate AI Meal Plan')}
          </DialogTitle>
          <DialogDescription>
            {isRTL 
              ? 'خصص خطة وجباتك باستخدام الذكاء الاصطناعي المتطور'
              : 'Customize your meal plan using advanced AI technology'
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
                    {isRTL ? 'أرصدة الذكاء الاصطناعي: الأرصدة المتبقية' : 'AI Credits: Credits Remaining'}
                  </span>
                </div>
                <Badge variant="secondary" className="bg-white">
                  {displayCredits}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Health Conditions Display */}
          {(healthConditions.length > 0 || allergies.length > 0 || dietaryRestrictions.length > 0) && (
            <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="font-medium text-red-800">
                    {isRTL ? 'الحالات الصحية والقيود الغذائية' : 'Health Conditions & Dietary Requirements'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {healthConditions.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-red-700 mb-1 block">
                        {isRTL ? 'الحالات الصحية:' : 'Health Conditions:'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {healthConditions.map((condition, index) => (
                          <Badge key={index} variant="outline" className="bg-red-100 text-red-800 border-red-300 text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {allergies.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-red-700 mb-1 block">
                        {isRTL ? 'الحساسية:' : 'Allergies:'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {allergies.map((allergy, index) => (
                          <Badge key={index} variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {dietaryRestrictions.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-red-700 mb-1 block">
                        {isRTL ? 'القيود الغذائية:' : 'Dietary Restrictions:'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {dietaryRestrictions.map((restriction, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                            <Info className="w-3 h-3 mr-1" />
                            {restriction}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 p-2 bg-white/60 rounded-md">
                  <p className="text-xs text-red-600">
                    {isRTL 
                      ? 'سيتم مراعاة هذه المعلومات عند إنشاء خطة الوجبات الخاصة بك'
                      : 'These will be considered when generating your personalized meal plan'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Meal Configuration */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">
                {t('Include Snacks')}
              </Label>
              <div className="flex items-center gap-3">
                <Switch
                  checked={preferences.includeSnacks !== false}
                  onCheckedChange={handleIncludeSnacksChange}
                />
                <span className="text-sm text-gray-600">
                  {getMealsPerDayText()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-md">
                <Info className="w-3 h-3" />
                <span>
                  {isRTL 
                    ? preferences.includeSnacks !== false
                      ? 'سيتم إنشاء 5 وجبات يومياً (فطار، وجبة خفيفة، غداء، وجبة خفيفة، عشاء)'
                      : 'سيتم إنشاء 3 وجبات يومياً (فطار، غداء، عشاء)'
                    : preferences.includeSnacks !== false
                      ? 'Will generate 5 meals per day (breakfast, snack, lunch, snack, dinner)'
                      : 'Will generate 3 meals per day (breakfast, lunch, dinner)'
                  }
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cuisine">
                  {t('Cuisine Type')}
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
                  {t('Max Prep Time')} ({isRTL ? 'دقيقة' : 'minutes'})
                </Label>
                <Select
                  value={preferences.maxPrepTime || '30'}
                  onValueChange={handleMaxPrepTimeChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 {isRTL ? 'دقيقة' : 'minutes'}</SelectItem>
                    <SelectItem value="30">30 {isRTL ? 'دقيقة' : 'minutes'}</SelectItem>
                    <SelectItem value="45">45 {isRTL ? 'دقيقة' : 'minutes'}</SelectItem>
                    <SelectItem value="60">60 {isRTL ? 'دقيقة' : 'minutes'}</SelectItem>
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
              disabled={isGenerating}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !hasCredits}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {getButtonText()}
            </Button>
          </div>

          {!hasCredits && (
            <div className="text-center text-red-600 text-sm">
              {isRTL 
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

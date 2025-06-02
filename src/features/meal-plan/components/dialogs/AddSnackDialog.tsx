
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Plus, Flame, Clock, Target } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import EnhancedLoadingIndicator from '@/components/ui/enhanced-loading-indicator';
import type { AddSnackDialogProps } from '../../types';

export const AddSnackDialog = ({
  isOpen,
  onClose,
  currentDayCalories,
  targetDayCalories,
  selectedDay,
  weeklyPlanId,
  onSnackAdded
}: AddSnackDialogProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { t, language, isRTL } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [snackType, setSnackType] = useState('healthy');
  const [customRequest, setCustomRequest] = useState('');
  const [customSnack, setCustomSnack] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const remainingCalories = Math.max(0, targetDayCalories - currentDayCalories);
  const progressPercentage = Math.min(100, (currentDayCalories / targetDayCalories) * 100);

  const handleGenerateAISnack = async () => {
    if (!user || !weeklyPlanId) {
      toast.error(t('mealPlan.errors.missingData') || 'Missing required data');
      return;
    }

    if (remainingCalories < 50) {
      toast.error(t('mealPlan.addSnack.notEnoughCalories') || 'Not enough calories remaining for a snack');
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('🚀 Generating AI snack:', {
        userId: user.id,
        weeklyPlanId,
        selectedDay,
        remainingCalories,
        snackType,
        customRequest
      });

      const { data, error } = await supabase.functions.invoke('generate-ai-snack', {
        body: {
          userProfile: profile,
          dayNumber: selectedDay,
          targetCalories: Math.min(remainingCalories, 200),
          weeklyPlanId,
          snackType,
          customRequest,
          language
        }
      });

      if (error) {
        console.error('Error generating AI snack:', error);
        toast.error(t('mealPlan.addSnack.failed') || 'Failed to generate snack');
        return;
      }

      if (data?.success) {
        toast.success(t('mealPlan.addSnack.success') || 'Snack added successfully!');
        onClose();
        await onSnackAdded();
      } else {
        toast.error(data?.error || t('mealPlan.addSnack.failed') || 'Failed to generate snack');
      }
      
    } catch (error) {
      console.error('Error generating AI snack:', error);
      toast.error(t('mealPlan.addSnack.failed') || 'Failed to generate snack');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddCustomSnack = async () => {
    if (!customSnack.name || !customSnack.calories) {
      toast.error(t('mealPlan.addSnack.fillRequired') || 'Please fill in snack name and calories');
      return;
    }

    if (!weeklyPlanId) {
      toast.error(t('mealPlan.errors.noMealPlan') || 'No meal plan found');
      return;
    }

    try {
      const { error } = await supabase.from('daily_meals').insert({
        weekly_plan_id: weeklyPlanId,
        day_number: selectedDay,
        meal_type: 'snack',
        name: `🍎 ${customSnack.name}`,
        calories: parseInt(customSnack.calories),
        protein: parseFloat(customSnack.protein) || 0,
        carbs: parseFloat(customSnack.carbs) || 0,
        fat: parseFloat(customSnack.fat) || 0,
        ingredients: [{ name: customSnack.name, quantity: '1', unit: 'serving' }],
        instructions: [t('mealPlan.addSnack.enjoyAsSnack') || 'Enjoy as a healthy snack'],
        prep_time: 0,
        cook_time: 0,
        servings: 1
      });

      if (error) throw error;

      toast.success(t('mealPlan.addSnack.customSuccess') || 'Custom snack added successfully!');
      setCustomSnack({ name: '', calories: '', protein: '', carbs: '', fat: '' });
      onClose();
      await onSnackAdded();
    } catch (error) {
      console.error('Error adding custom snack:', error);
      toast.error(t('mealPlan.addSnack.failed') || 'Failed to add snack');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t('mealPlan.addSnack') || 'Add Snack'}</h2>
              <p className="text-sm text-gray-500 font-normal">
                {t('mealPlan.day') || 'Day'} {selectedDay} - {t('mealPlan.addSnack.smartSnacking') || 'Smart snacking for your goals'}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5">
          {/* Enhanced Calorie Progress Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">
                    {t('mealPlan.addSnack.dailyProgress') || 'Daily Progress'}
                  </span>
                </div>
                <span className="text-sm font-bold text-blue-700">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{currentDayCalories} cal consumed</span>
                  <span className="text-gray-600">{remainingCalories} cal remaining</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-center text-gray-500">
                  Target: {targetDayCalories} calories
                </div>
              </div>
            </CardContent>
          </Card>

          {isGenerating ? (
            <EnhancedLoadingIndicator
              status="loading"
              type="recipe"
              message={t('mealPlan.addSnack.generating') || 'Generating AI Snack'}
              description={t('mealPlan.addSnack.generatingDesc') || 'Creating the perfect snack for your remaining calories'}
              variant="card"
              size="md"
              showSteps={true}
            />
          ) : (
            <>
              {/* AI Generated Snack Section */}
              <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-green-800">
                      {t('mealPlan.addSnack.aiGenerated') || 'AI Generated Snack'}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="snack-type" className="text-sm font-medium">{t('mealPlan.addSnack.snackType') || 'Snack Type'}</Label>
                      <Select value={snackType} onValueChange={setSnackType}>
                        <SelectTrigger className="h-10 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="healthy">{t('mealPlan.addSnack.types.healthy') || 'Healthy & Nutritious'}</SelectItem>
                          <SelectItem value="protein">{t('mealPlan.addSnack.types.protein') || 'High Protein'}</SelectItem>
                          <SelectItem value="energy">{t('mealPlan.addSnack.types.energy') || 'Energy Boosting'}</SelectItem>
                          <SelectItem value="sweet">{t('mealPlan.addSnack.types.sweet') || 'Sweet Treat'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="custom-request" className="text-sm font-medium">{t('mealPlan.addSnack.customRequest') || 'Custom Request (Optional)'}</Label>
                      <Input
                        id="custom-request"
                        placeholder={t('mealPlan.addSnack.customRequestPlaceholder') || 'e.g., nuts and fruits, low carb...'}
                        value={customRequest}
                        onChange={(e) => setCustomRequest(e.target.value)}
                        className="h-10 mt-1"
                      />
                    </div>

                    <Button 
                      onClick={handleGenerateAISnack} 
                      className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-10 font-semibold ${isRTL ? 'flex-row-reverse' : ''}`}
                      disabled={isGenerating || remainingCalories <= 0}
                    >
                      <Sparkles className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('mealPlan.addSnack.generateAI') || 'Generate AI Snack'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Custom Snack Section */}
              <Card className="border-gray-200 bg-gray-50">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Plus className="w-4 h-4 text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">
                      {t('mealPlan.addSnack.customSnack') || 'Custom Snack'}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="snack-name" className="text-sm font-medium">{t('mealPlan.addSnack.snackName') || 'Snack Name'}</Label>
                      <Input
                        id="snack-name"
                        value={customSnack.name}
                        onChange={(e) => setCustomSnack({...customSnack, name: e.target.value})}
                        placeholder={t('mealPlan.addSnack.snackNamePlaceholder') || 'e.g., Apple with peanut butter'}
                        className="h-10 mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="calories" className="text-sm font-medium">{t('mealPlan.calories') || 'Calories'}</Label>
                        <Input
                          id="calories"
                          type="number"
                          value={customSnack.calories}
                          onChange={(e) => setCustomSnack({...customSnack, calories: e.target.value})}
                          placeholder="200"
                          className="h-10 mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="protein" className="text-sm font-medium">{t('mealPlan.protein') || 'Protein'} (g)</Label>
                        <Input
                          id="protein"
                          type="number"
                          value={customSnack.protein}
                          onChange={(e) => setCustomSnack({...customSnack, protein: e.target.value})}
                          placeholder="5"
                          className="h-10 mt-1"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleAddCustomSnack}
                      className={`w-full h-10 font-semibold ${isRTL ? 'flex-row-reverse' : ''}`}
                      variant="outline"
                    >
                      <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('mealPlan.addSnack.addCustom') || 'Add Custom Snack'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Cancel Button */}
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="w-full h-10"
          >
            {t('cancel') || 'Cancel'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

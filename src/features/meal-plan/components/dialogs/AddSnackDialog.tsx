
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Plus, Flame } from "lucide-react";
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Plus className="w-5 h-5 text-green-600" />
            {t('mealPlan.addSnack.title') || 'Add Snack'} - {t('mealPlan.day') || 'Day'} {selectedDay}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Calorie Info */}
          <div className={`flex items-center gap-2 p-3 bg-blue-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-blue-800">
              {t('mealPlan.addSnack.caloriesRemaining') || 'Remaining calories for today'}: 
              <span className="font-bold ml-1">{remainingCalories}</span>
            </span>
          </div>

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
              <div className="space-y-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  {t('mealPlan.addSnack.aiGenerated') || 'AI Generated Snack'}
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="snack-type">{t('mealPlan.addSnack.snackType') || 'Snack Type'}</Label>
                    <Select value={snackType} onValueChange={setSnackType}>
                      <SelectTrigger>
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
                    <Label htmlFor="custom-request">{t('mealPlan.addSnack.customRequest') || 'Custom Request (Optional)'}</Label>
                    <Input
                      id="custom-request"
                      placeholder={t('mealPlan.addSnack.customRequestPlaceholder') || 'e.g., nuts and fruits, low carb, quick prep...'}
                      value={customRequest}
                      onChange={(e) => setCustomRequest(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleGenerateAISnack} 
                    className={`w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 ${isRTL ? 'flex-row-reverse' : ''}`}
                    disabled={isGenerating || remainingCalories <= 0}
                  >
                    <Sparkles className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('mealPlan.addSnack.generateAI') || 'Generate AI Snack'}
                  </Button>
                </div>
              </div>

              {/* Custom Snack Section */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold flex items-center gap-2">
                  <Plus className="w-4 h-4 text-gray-600" />
                  {t('mealPlan.addSnack.customSnack') || 'Custom Snack'}
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="snack-name">{t('mealPlan.addSnack.snackName') || 'Snack Name'}</Label>
                    <Input
                      id="snack-name"
                      value={customSnack.name}
                      onChange={(e) => setCustomSnack({...customSnack, name: e.target.value})}
                      placeholder={t('mealPlan.addSnack.snackNamePlaceholder') || 'e.g., Apple with peanut butter'}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="calories">{t('mealPlan.calories') || 'Calories'}</Label>
                      <Input
                        id="calories"
                        type="number"
                        value={customSnack.calories}
                        onChange={(e) => setCustomSnack({...customSnack, calories: e.target.value})}
                        placeholder="200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="protein">{t('mealPlan.protein') || 'Protein'} (g)</Label>
                      <Input
                        id="protein"
                        type="number"
                        value={customSnack.protein}
                        onChange={(e) => setCustomSnack({...customSnack, protein: e.target.value})}
                        placeholder="5"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="carbs">{t('mealPlan.carbs') || 'Carbs'} (g)</Label>
                      <Input
                        id="carbs"
                        type="number"
                        value={customSnack.carbs}
                        onChange={(e) => setCustomSnack({...customSnack, carbs: e.target.value})}
                        placeholder="15"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fat">{t('mealPlan.fat') || 'Fat'} (g)</Label>
                      <Input
                        id="fat"
                        type="number"
                        value={customSnack.fat}
                        onChange={(e) => setCustomSnack({...customSnack, fat: e.target.value})}
                        placeholder="8"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleAddCustomSnack}
                    className={`w-full ${isRTL ? 'flex-row-reverse' : ''}`}
                    variant="outline"
                  >
                    <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('mealPlan.addSnack.addCustom') || 'Add Custom Snack'}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Cancel Button */}
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="w-full"
          >
            {t('cancel') || 'Cancel'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

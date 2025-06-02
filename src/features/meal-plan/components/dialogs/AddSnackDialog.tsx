
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Plus, Target } from "lucide-react";
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
  onSnackAdded,
  weekStartDate
}: AddSnackDialogProps & { weekStartDate: Date }) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { t, language, isRTL } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [customSnack, setCustomSnack] = useState({
    name: '',
    calories: '',
    protein: ''
  });

  const remainingCalories = Math.max(0, targetDayCalories - currentDayCalories);
  const progressPercentage = Math.min(100, (currentDayCalories / targetDayCalories) * 100);

  // Get real date for selected day
  const getRealDate = (dayNumber: number) => {
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + (dayNumber - 1));
    return date.toLocaleDateString();
  };

  const handleGenerateAISnack = async () => {
    if (!user || !weeklyPlanId) {
      toast.error('Missing required data');
      return;
    }

    if (remainingCalories < 50) {
      toast.error('Not enough calories remaining for a snack');
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('🚀 Starting AI snack generation with correct payload:', {
        userProfile: profile,
        day: selectedDay,
        calories: Math.min(remainingCalories, 200),
        weeklyPlanId,
        language
      });

      const { data, error } = await supabase.functions.invoke('generate-ai-snack', {
        body: {
          userProfile: profile,
          day: selectedDay,
          calories: Math.min(remainingCalories, 200),
          weeklyPlanId,
          language
        }
      });

      if (error) {
        console.error('Error generating AI snack:', error);
        toast.error('Failed to generate snack. Please try again.');
        return;
      }

      if (data?.success) {
        toast.success('Snack added successfully!');
        onClose();
        await onSnackAdded();
      } else {
        console.error('Generation failed:', data);
        toast.error(data?.error || 'Failed to generate snack. Please try again.');
      }
      
    } catch (error) {
      console.error('Error generating AI snack:', error);
      toast.error('Failed to generate snack. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddCustomSnack = async () => {
    if (!customSnack.name || !customSnack.calories) {
      toast.error('Please fill in snack name and calories');
      return;
    }

    if (!weeklyPlanId) {
      toast.error('No meal plan found');
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
        carbs: 0,
        fat: 0,
        ingredients: [{ name: customSnack.name, quantity: '1', unit: 'serving' }],
        instructions: ['Enjoy as a healthy snack'],
        prep_time: 0,
        cook_time: 0,
        servings: 1
      });

      if (error) throw error;

      toast.success('Custom snack added successfully!');
      setCustomSnack({ name: '', calories: '', protein: '' });
      onClose();
      await onSnackAdded();
    } catch (error) {
      console.error('Error adding custom snack:', error);
      toast.error('Failed to add snack');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-3 text-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-green-600" />
            </div>
            Add Snack - {getRealDate(selectedDay)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Calorie Progress */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    {remainingCalories} cal remaining
                  </span>
                </div>
                <span className="text-xs text-blue-700">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          {isGenerating ? (
            <EnhancedLoadingIndicator
              status="loading"
              type="recipe"
              message="Generating AI Snack"
              variant="card"
              size="sm"
            />
          ) : (
            <Tabs defaultValue="ai" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ai" className="text-sm">AI Generate</TabsTrigger>
                <TabsTrigger value="custom" className="text-sm">Custom</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ai" className="space-y-3 mt-4">
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-medium mb-2">AI Generated Snack</h3>
                  <p className="text-xs text-gray-600 mb-4">
                    Perfect snack for your remaining {remainingCalories} calories
                  </p>
                  <Button 
                    onClick={handleGenerateAISnack} 
                    className="w-full bg-purple-600 hover:bg-purple-700 h-9"
                    disabled={isGenerating || remainingCalories <= 0}
                  >
                    <Sparkles className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    Generate AI Snack
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="custom" className="space-y-3 mt-4">
                <div>
                  <Label className="text-sm">Snack Name</Label>
                  <Input
                    value={customSnack.name}
                    onChange={(e) => setCustomSnack({...customSnack, name: e.target.value})}
                    placeholder="Apple with peanut butter"
                    className="h-9 mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-sm">Calories</Label>
                    <Input
                      type="number"
                      value={customSnack.calories}
                      onChange={(e) => setCustomSnack({...customSnack, calories: e.target.value})}
                      placeholder="150"
                      className="h-9 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Protein (g)</Label>
                    <Input
                      type="number"
                      value={customSnack.protein}
                      onChange={(e) => setCustomSnack({...customSnack, protein: e.target.value})}
                      placeholder="5"
                      className="h-9 mt-1"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleAddCustomSnack}
                  className="w-full h-9"
                  variant="outline"
                >
                  <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  Add Custom Snack
                </Button>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};


import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeftRight, Sparkles, Clock, Users, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import type { DailyMeal } from "@/hooks/useMealPlanData";

interface MealExchangeDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  currentMeal: DailyMeal | null;
  onExchange?: () => void;
}

interface ExchangeStep {
  id: string;
  title: string;
  description: string;
}

const EXCHANGE_STEPS: ExchangeStep[] = [
  { id: 'analyzing', title: 'Analyzing Current Meal', description: 'Processing nutritional requirements and preferences...' },
  { id: 'searching', title: 'Finding Alternatives', description: 'Searching for meals with similar nutrition profiles...' },
  { id: 'matching', title: 'Matching Preferences', description: 'Ensuring new meal matches your dietary requirements...' },
  { id: 'finalizing', title: 'Finalizing Exchange', description: 'Updating your meal plan with the new selection...' }
];

const MealExchangeDialog = ({ isOpen, onClose, currentMeal, onExchange }: MealExchangeDialogProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [isExchanging, setIsExchanging] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [stepProgress, setStepProgress] = useState(0);
  const [exchangeReason, setExchangeReason] = useState('preference');

  // Debug logging for meal data
  console.log('🔄 MealExchangeDialog rendered with meal:', {
    hasMeal: !!currentMeal,
    mealId: currentMeal?.id,
    mealName: currentMeal?.name,
    isOpen
  });

  const handleExchangeMeal = async () => {
    if (!currentMeal || !user || !profile) {
      toast.error('Missing required information for meal exchange');
      return;
    }

    setIsExchanging(true);
    
    try {
      // Step 1: Analyzing current meal
      setCurrentStep('analyzing');
      setStepProgress(25);
      console.log('🔍 Step 1: Analyzing current meal requirements...');
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Step 2: Finding alternatives
      setCurrentStep('searching');
      setStepProgress(50);
      console.log('🔍 Step 2: Searching for suitable alternatives...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 3: Matching preferences
      setCurrentStep('matching');
      setStepProgress(75);
      console.log('🎯 Step 3: Matching dietary preferences...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data, error } = await supabase.functions.invoke('exchange-meal', {
        body: {
          mealId: currentMeal.id,
          mealType: currentMeal.meal_type,
          dayNumber: currentMeal.day_number,
          weeklyPlanId: currentMeal.weekly_plan_id,
          userProfile: {
            ...profile,
            dietary_restrictions: profile.dietary_restrictions || [],
            allergies: profile.allergies || [],
            preferred_foods: profile.preferred_foods || [],
            fitness_goal: profile.fitness_goal,
            activity_level: profile.activity_level
          },
          exchangeReason,
          targetCalories: currentMeal.calories,
          targetProtein: currentMeal.protein,
          targetCarbs: currentMeal.carbs,
          targetFat: currentMeal.fat,
          preferences: {
            similar_nutrition: true,
            respect_dietary_restrictions: true,
            avoid_recent_meals: true
          }
        }
      });

      // Step 4: Finalizing
      setCurrentStep('finalizing');
      setStepProgress(100);
      console.log('💾 Step 4: Finalizing meal exchange...');
      await new Promise(resolve => setTimeout(resolve, 800));

      if (error) {
        console.error('❌ Meal exchange error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Meal exchanged successfully:', data);
        toast.success(`Meal exchanged successfully! New meal: ${data.newMeal?.name || 'Updated'}`);
        onExchange?.();
        onClose(false);
      } else {
        throw new Error(data?.error || 'Failed to exchange meal');
      }
    } catch (error: any) {
      console.error('❌ Error exchanging meal:', error);
      toast.error(error.message || 'Failed to exchange meal');
    } finally {
      setIsExchanging(false);
      setCurrentStep('');
      setStepProgress(0);
    }
  };

  // Don't render if no meal is selected
  if (!currentMeal) {
    console.log('⚠️ MealExchangeDialog: No current meal provided');
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-blue-500" />
            Exchange Meal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Meal Info */}
          <Card className="border-2 border-blue-100">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Current Meal
              </h3>
              <p className="font-medium text-lg mb-3">{currentMeal.name}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {(currentMeal.prep_time || 0) + (currentMeal.cook_time || 0)} min
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {currentMeal.servings} serving{currentMeal.servings !== 1 ? 's' : ''}
                </Badge>
                <Badge className="bg-green-100 text-green-700 text-xs">
                  {currentMeal.calories} cal
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 p-2 rounded text-center">
                  <span className="font-medium text-green-600 text-sm">{currentMeal.protein}g</span>
                  <div className="text-xs text-gray-600">protein</div>
                </div>
                <div className="bg-blue-50 p-2 rounded text-center">
                  <span className="font-medium text-blue-600 text-sm">{currentMeal.carbs}g</span>
                  <div className="text-xs text-gray-600">carbs</div>
                </div>
                <div className="bg-blue-50 p-2 rounded text-center">
                  <span className="font-medium text-yellow-600 text-sm">{currentMeal.fat}g</span>
                  <div className="text-xs text-gray-600">fat</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchange Reason Selection */}
          {!isExchanging && (
            <div className="space-y-3">
              <Label htmlFor="exchange-reason" className="text-sm font-medium">
                Why do you want to exchange this meal?
              </Label>
              <Select value={exchangeReason} onValueChange={setExchangeReason}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preference">Don't like this meal</SelectItem>
                  <SelectItem value="dietary">Dietary restrictions</SelectItem>
                  <SelectItem value="ingredients">Missing ingredients</SelectItem>
                  <SelectItem value="time">Too time consuming</SelectItem>
                  <SelectItem value="variety">Want more variety</SelectItem>
                  <SelectItem value="nutrition">Different nutrition needs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Exchange Progress */}
          {isExchanging && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <div>
                      <h3 className="font-semibold text-blue-800 text-sm">
                        {EXCHANGE_STEPS.find(step => step.id === currentStep)?.title || 'Processing...'}
                      </h3>
                      <p className="text-xs text-blue-600">
                        {EXCHANGE_STEPS.find(step => step.id === currentStep)?.description || 'Please wait...'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-blue-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${stepProgress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-blue-600">
                    {EXCHANGE_STEPS.map((step, index) => (
                      <span 
                        key={step.id}
                        className={stepProgress > (index * 25) ? 'font-semibold' : 'opacity-50'}
                      >
                        {index + 1}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Exchange Info */}
          {!isExchanging && (
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Smart Exchange
                </h3>
                <p className="text-purple-600 text-sm mb-3">
                  AI will find a meal with similar nutrition that matches your preferences and dietary requirements.
                </p>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-purple-600">Target Calories:</span>
                    <span className="text-purple-700 font-medium">{currentMeal.calories} kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-600">Meal Type:</span>
                    <span className="text-purple-700 font-medium capitalize">{currentMeal.meal_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-600">Day:</span>
                    <span className="text-purple-700 font-medium">Day {currentMeal.day_number}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => onClose(false)}
              variant="outline"
              className="flex-1"
              disabled={isExchanging}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExchangeMeal}
              disabled={isExchanging}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              {isExchanging ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exchanging...
                </>
              ) : (
                <>
                  <ArrowLeftRight className="w-4 h-4 mr-2" />
                  Exchange Meal
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealExchangeDialog;

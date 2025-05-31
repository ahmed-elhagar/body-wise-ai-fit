import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, X, Target, Clock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface EnhancedAddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  weeklyPlanId: string | null;
  onSnackAdded: () => void;
  currentDayCalories: number;
  targetDayCalories: number;
}

const EnhancedAddSnackDialog = ({ 
  isOpen, 
  onClose, 
  selectedDay, 
  weeklyPlanId, 
  onSnackAdded,
  currentDayCalories,
  targetDayCalories
}: EnhancedAddSnackDialogProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { t, language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  const handleClose = () => {
    setIsGenerating(false);
    setGenerationStep('');
    onClose();
  };

  const getDynamicTargetCalories = () => {
    if (profile?.weight && profile?.height && profile?.age) {
      const weight = Number(profile.weight);
      const height = Number(profile.height);
      const age = Number(profile.age);
      
      let bmr = 0;
      if (profile.gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
      
      const activityMultipliers = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725,
        'extremely_active': 1.9
      };
      
      const multiplier = activityMultipliers[profile.activity_level as keyof typeof activityMultipliers] || 1.375;
      
      let calorieAdjustment = 1;
      if (profile.fitness_goal === 'lose_weight') {
        calorieAdjustment = 0.85;
      } else if (profile.fitness_goal === 'gain_weight') {
        calorieAdjustment = 1.15;
      }
      
      return Math.round(bmr * multiplier * calorieAdjustment);
    }
    
    return targetDayCalories || 2000;
  };

  const dynamicTargetCalories = getDynamicTargetCalories();
  const remainingCalories = Math.max(0, dynamicTargetCalories - currentDayCalories);
  const progressPercentage = Math.min((currentDayCalories / dynamicTargetCalories) * 100, 100);

  const getStepLabel = (step: string) => {
    switch (step) {
      case 'analyzing':
        return t('mealPlan.addSnackDialog.analyzing') || 'Analyzing your nutrition needs...';
      case 'creating':
        return t('mealPlan.addSnackDialog.creating') || 'Creating perfect snack...';
      case 'saving':
        return t('mealPlan.addSnackDialog.saving') || 'Saving to your meal plan...';
      default:
        return t('mealPlan.addSnackDialog.generatingAISnack') || 'Generating AI Snack...';
    }
  };

  const handleGenerateAISnack = async () => {
    if (!user || !weeklyPlanId) {
      toast.error(t('mealPlan.addSnackDialog.error') || 'Error generating snack');
      return;
    }

    if (remainingCalories < 50) {
      toast.error(t('mealPlan.addSnackDialog.notEnoughCalories') || 'Not enough calories remaining for a snack');
      return;
    }

    setIsGenerating(true);
    
    try {
      setGenerationStep('analyzing');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setGenerationStep('creating');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data, error } = await supabase.functions.invoke('generate-ai-snack', {
        body: {
          userProfile: profile,
          day: selectedDay,
          calories: remainingCalories,
          weeklyPlanId,
          language
        }
      });

      if (error) {
        console.error('❌ Error generating AI snack:', error);
        toast.error(t('mealPlan.addSnackDialog.failed') || 'Failed to generate snack');
        return;
      }

      setGenerationStep('saving');
      await new Promise(resolve => setTimeout(resolve, 800));

      if (data?.success) {
        toast.success(data.message || t('mealPlan.snackAddedSuccess'));
        onClose();
        onSnackAdded();
      } else {
        console.error('❌ Generation failed:', data?.error);
        toast.error(data?.error || t('mealPlan.addSnackDialog.failed') || 'Failed to generate snack');
      }
      
    } catch (error) {
      console.error('❌ Error generating AI snack:', error);
      toast.error(t('mealPlan.addSnackDialog.failed') || 'Failed to generate snack');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-2xl mx-4 sm:mx-auto bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-2xl rounded-2xl"
        onPointerDownOutside={(e) => {
          if (isGenerating) {
            e.preventDefault();
            return;
          }
          handleClose();
        }}
        onEscapeKeyDown={(e) => {
          if (isGenerating) {
            e.preventDefault();
            return;
          }
          handleClose();
        }}
      >
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-green-800">
                  {t('mealPlan.addSnackDialog.title') || 'Add Healthy Snack'}
                </DialogTitle>
                <p className="text-green-600 text-sm">
                  {t('mealPlan.addSnackDialog.subtitle') || 'Perfect snack for your remaining calories'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleClose}
              disabled={isGenerating}
              className="hover:bg-green-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 pb-2">
          {/* Daily Progress Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-600" />
                  {t('mealPlan.dailyProgress') || 'Daily Progress'}
                </h3>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Day {selectedDay}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('mealPlan.calories') || 'Calories'}</span>
                  <span className="font-semibold">
                    {currentDayCalories} / {dynamicTargetCalories}
                  </span>
                </div>
                
                <Progress 
                  value={progressPercentage} 
                  className="h-3 bg-gray-200"
                />
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{Math.round(progressPercentage)}% {t('mealPlan.complete') || 'complete'}</span>
                  <span>{remainingCalories} {t('mealPlan.addSnackDialog.caloriesAvailable') || 'calories available'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generation Content */}
          {isGenerating ? (
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-pulse mb-4">
                  <Sparkles className="w-8 h-8 text-white animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  {getStepLabel(generationStep)}
                </h3>
                <div className="w-full bg-green-100 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500 w-1/3"></div>
                </div>
                <p className="text-green-600 text-sm">
                  {t('mealPlan.addSnackDialog.pleaseWait') || 'Please wait while we create the perfect snack for you...'}
                </p>
              </CardContent>
            </Card>
          ) : remainingCalories < 50 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  {t('mealPlan.addSnackDialog.targetReached') || 'Daily target reached!'}
                </h3>
                <p className="text-green-600 mb-4">
                  {t('mealPlan.addSnackDialog.targetReachedDesc') || "You've reached your calorie goal for today. Great job!"}
                </p>
                <Button
                  onClick={handleClose}
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                >
                  {t('mealPlan.addSnackDialog.close') || 'Close'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    {t('mealPlan.addSnackDialog.generateSnack') || 'Generate AI Snack'}
                  </h3>
                  <p className="text-green-600 mb-4">
                    {t('mealPlan.addSnackDialog.perfectFit') || 'Perfect fit for your remaining calories'}
                  </p>
                  
                  <Badge className="bg-green-100 text-green-700 border-green-200 px-4 py-2 text-lg font-semibold">
                    {remainingCalories} {t('mealPlan.cal') || 'cal'}
                  </Badge>
                </div>
                
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    {t('mealPlan.addSnackDialog.cancel') || 'Cancel'}
                  </Button>
                  
                  <Button
                    onClick={handleGenerateAISnack}
                    disabled={isGenerating}
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t('mealPlan.addSnackDialog.generateAISnack') || 'Generate AI Snack'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedAddSnackDialog;

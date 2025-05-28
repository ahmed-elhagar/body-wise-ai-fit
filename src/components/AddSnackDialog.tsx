
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Loader2, Plus, Utensils, Target, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  weeklyPlanId: string | null;
  onSnackAdded: () => void;
  currentDayCalories: number;
  targetDayCalories: number;
}

const AddSnackDialog = ({ 
  isOpen, 
  onClose, 
  selectedDay, 
  weeklyPlanId, 
  onSnackAdded,
  currentDayCalories,
  targetDayCalories
}: AddSnackDialogProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { t, isRTL } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);

  const dayNames = [
    t('day.monday'), t('day.tuesday'), t('day.wednesday'), 
    t('day.thursday'), t('day.friday'), t('day.saturday'), t('day.sunday')
  ];

  const remainingCalories = Math.max(0, targetDayCalories - currentDayCalories);
  const calorieProgress = Math.min((currentDayCalories / targetDayCalories) * 100, 100);

  const handleGenerateAISnack = async () => {
    if (!user || !weeklyPlanId) {
      toast.error(t('addSnack.error'));
      return;
    }

    if (remainingCalories < 50) {
      toast.error(t('addSnack.notEnoughCalories'));
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('Generating AI snack with params:', {
        userProfile: profile,
        dayNumber: selectedDay,
        remainingCalories,
        weeklyPlanId
      });

      const { data, error } = await supabase.functions.invoke('generate-ai-snack', {
        body: {
          userProfile: profile,
          dayNumber: selectedDay,
          remainingCalories,
          weeklyPlanId
        }
      });

      if (error) {
        console.error('Error generating AI snack:', error);
        toast.error(t('addSnack.error'));
        return;
      }

      console.log('AI snack generated successfully:', data);
      toast.success(t('addSnack.success'));
      onSnackAdded();
      onClose();
      
    } catch (error) {
      console.error('Error generating AI snack:', error);
      toast.error(t('addSnack.error'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md mx-4 sm:mx-auto ${isRTL ? 'text-right' : 'text-left'}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 bg-fitness-gradient rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {t('addSnack.title')} - {dayNames[selectedDay - 1]}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Enhanced Calories Information Card */}
          <Card className="p-6 bg-gradient-to-br from-fitness-primary/10 via-white to-pink-50 border-0 shadow-lg">
            <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 bg-fitness-gradient rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {t('addSnack.caloriesRemaining')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentDayCalories} / {targetDayCalories} {t('mealPlan.calPerDay')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-fitness-primary">
                  {remainingCalories}
                </div>
                <div className="text-xs text-gray-500">{t('mealPlan.calories')}</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-gray-600">{t('mealPlan.progress')}</span>
                <span className="font-medium">{Math.round(calorieProgress)}%</span>
              </div>
              <Progress value={calorieProgress} className="h-3" />
            </div>
          </Card>

          {remainingCalories < 50 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t('addSnack.targetReached')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('addSnack.targetReachedDesc')}
              </p>
              <Button variant="outline" onClick={onClose} className="w-full">
                {t('addSnack.cancel')}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                  <Sparkles className="w-10 h-10 text-white animate-pulse" />
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {t('addSnack.aiPoweredTitle')}
                </h3>
                <p className="text-gray-600 text-sm px-4 leading-relaxed">
                  {t('addSnack.aiDescription').replace('{calories}', remainingCalories.toString())}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">{t('addSnack.quickPrep')}</span>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Utensils className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700">{t('addSnack.healthy')}</span>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-700">{t('addSnack.perfectFit')}</span>
                </div>
              </div>

              <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  {t('addSnack.cancel')}
                </Button>
                <Button 
                  onClick={handleGenerateAISnack} 
                  disabled={isGenerating}
                  className="flex-1 bg-fitness-gradient hover:opacity-90 text-white shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('addSnack.generating')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {t('addSnack.generateSnack')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSnackDialog;

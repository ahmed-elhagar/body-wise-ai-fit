
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Loader2, Target, Zap, Utensils, Clock, CheckCircle, AlertCircle } from "lucide-react";
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
  const isNearTarget = calorieProgress >= 95;

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
      <DialogContent className={`max-w-lg mx-4 sm:mx-auto ${isRTL ? 'text-right' : 'text-left'}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-fitness-gradient rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-800">{t('addSnack.title')}</div>
              <div className="text-sm font-normal text-gray-600">{dayNames[selectedDay - 1]}</div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Enhanced Calories Information Card */}
          <Card className="p-6 bg-gradient-to-br from-fitness-primary/5 via-white to-green-50 border-0 shadow-lg">
            <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                  isNearTarget ? 'bg-green-gradient' : 'bg-fitness-gradient'
                }`}>
                  {isNearTarget ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Target className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {t('addSnack.dailyProgress')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentDayCalories} / {targetDayCalories} {t('mealPlan.calories')}
                  </p>
                </div>
              </div>
              <div className={`text-center ${isRTL ? 'text-left' : 'text-right'}`}>
                <div className={`text-3xl font-bold ${isNearTarget ? 'text-green-600' : 'text-fitness-primary'}`}>
                  {remainingCalories}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  {t('addSnack.remaining')}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-3">
              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-gray-600">{t('addSnack.calorieProgress')}</span>
                <span className="font-medium">{Math.round(calorieProgress)}%</span>
              </div>
              <Progress 
                value={calorieProgress} 
                className="h-3 bg-gray-100" 
              />
              {isNearTarget && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>{t('addSnack.excellentProgress')}</span>
                </div>
              )}
            </div>
          </Card>

          {remainingCalories < 50 ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {t('addSnack.targetReached')}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('addSnack.targetReachedDesc')}
              </p>
              <Button 
                variant="outline" 
                onClick={onClose} 
                className="w-full py-3 text-base font-medium"
              >
                {t('addSnack.understood')}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="w-24 h-24 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden shadow-xl">
                  <Sparkles className="w-12 h-12 text-white animate-pulse" />
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {t('addSnack.aiPoweredTitle')}
                </h3>
                <p className="text-gray-600 text-sm px-6 leading-relaxed">
                  {t('addSnack.aiDescription')}
                </p>
              </div>

              {/* Enhanced Features List */}
              <div className="grid grid-cols-1 gap-4">
                <div className={`flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-green-800">{t('addSnack.quickPrep')}</div>
                    <div className="text-sm text-green-600">{t('addSnack.quickPrepDesc')}</div>
                  </div>
                </div>
                
                <div className={`flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                    <Utensils className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-blue-800">{t('addSnack.nutritious')}</div>
                    <div className="text-sm text-blue-600">{t('addSnack.nutritiousDesc')}</div>
                  </div>
                </div>
                
                <div className={`flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-md">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-purple-800">{t('addSnack.perfectCalories')}</div>
                    <div className="text-sm text-purple-600">
                      {t('addSnack.perfectCaloriesDesc').replace('{calories}', remainingCalories.toString())}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`flex gap-4 pt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button 
                  variant="outline" 
                  onClick={onClose} 
                  className="flex-1 py-3 text-base font-medium"
                >
                  {t('addSnack.cancel')}
                </Button>
                <Button 
                  onClick={handleGenerateAISnack} 
                  disabled={isGenerating}
                  className="flex-1 py-3 text-base font-medium bg-fitness-gradient hover:opacity-90 text-white shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('addSnack.generating')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
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

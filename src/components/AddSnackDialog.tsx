
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, Plus, Utensils } from "lucide-react";
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
  const [generatedSnack, setGeneratedSnack] = useState<any>(null);

  const dayNames = isRTL ? [
    t('day.monday'), t('day.tuesday'), t('day.wednesday'), 
    t('day.thursday'), t('day.friday'), t('day.saturday'), t('day.sunday')
  ] : [
    t('day.monday'), t('day.tuesday'), t('day.wednesday'), 
    t('day.thursday'), t('day.friday'), t('day.saturday'), t('day.sunday')
  ];

  const remainingCalories = Math.max(0, targetDayCalories - currentDayCalories);

  const handleGenerateAISnack = async () => {
    if (!user || !weeklyPlanId) {
      toast.error(t('addSnack.error'));
      return;
    }

    if (remainingCalories < 50) {
      toast.error('Not enough calories remaining for a snack');
      return;
    }

    setIsGenerating(true);
    
    try {
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

      setGeneratedSnack(data.snack);
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
          <DialogTitle className={`flex items-center gap-2 text-lg sm:text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Sparkles className="w-5 h-5 text-fitness-primary" />
            {t('addSnack.title')} - {dayNames[selectedDay - 1]}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          {/* Calories Information Card */}
          <Card className="p-4 bg-gradient-to-r from-fitness-primary/10 to-pink-100">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Utensils className="w-6 h-6 text-fitness-primary" />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {t('addSnack.caloriesRemaining')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentDayCalories} / {targetDayCalories} {t('mealPlan.calPerDay')}
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-fitness-primary">
                {remainingCalories}
              </div>
            </div>
          </Card>

          {remainingCalories < 50 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                You've reached your calorie target for today!
              </p>
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                {t('addSnack.cancel')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  AI-Powered Snack Generation
                </h3>
                <p className="text-gray-600 text-sm px-4">
                  Our AI will create a healthy snack that fits perfectly within your remaining {remainingCalories} calories for today.
                </p>
              </div>

              <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  {t('addSnack.cancel')}
                </Button>
                <Button 
                  onClick={handleGenerateAISnack} 
                  disabled={isGenerating}
                  className="flex-1 bg-fitness-gradient text-white"
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

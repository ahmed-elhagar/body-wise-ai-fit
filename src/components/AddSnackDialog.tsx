
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { Plus, Sparkles } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

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
  const { t, language } = useI18n();
  const [isGenerating, setIsGenerating] = useState(false);
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
      toast.error(t('common:missingData'));
      return;
    }

    if (remainingCalories < 50) {
      toast.error(t('mealPlan:addSnackDialog.notEnoughCalories'));
      return;
    }

    setIsGenerating(true);
    
    try {
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
        toast.error(t('mealPlan:addSnackDialog.failed'));
        return;
      }

      if (data?.success) {
        toast.success(t('mealPlan:addSnackDialog.success'));
        onClose();
        onSnackAdded();
      } else {
        toast.error(data?.error || t('mealPlan:addSnackDialog.failed'));
      }
      
    } catch (error) {
      console.error('Error generating AI snack:', error);
      toast.error(t('mealPlan:addSnackDialog.failed'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddCustomSnack = async () => {
    if (!customSnack.name || !customSnack.calories) {
      toast.error(t('common:fillRequired'));
      return;
    }

    if (!weeklyPlanId) {
      toast.error(t('mealPlan:noMealPlan'));
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
        instructions: ['Enjoy as a healthy snack'],
        prep_time: 0,
        cook_time: 0,
        servings: 1
      });

      if (error) throw error;

      toast.success(t('mealPlan:addSnackDialog.success'));
      setCustomSnack({ name: '', calories: '', protein: '', carbs: '', fat: '' });
      onClose();
      onSnackAdded();
    } catch (error) {
      console.error('Error adding custom snack:', error);
      toast.error(t('mealPlan:addSnackDialog.failed'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('mealPlan:addSnackDialog.title')} - {t('common:day')} {selectedDay}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Calorie Info */}
          <div className="text-sm text-gray-600">
            <p>{t('mealPlan:addSnackDialog.caloriesAvailable')}: <span className="font-semibold">{remainingCalories}</span></p>
          </div>

          {/* AI Generated Snack */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {t('mealPlan:addSnackDialog.generateAISnack')}
              </h3>
              <p className="text-sm mb-4">
                {t('mealPlan:addSnackDialog.perfectFit')}
              </p>
              <Button 
                onClick={handleGenerateAISnack}
                disabled={isGenerating || remainingCalories < 50}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? t('mealPlan:addSnackDialog.generatingAISnack') : t('mealPlan:addSnackDialog.generateAISnack')}
              </Button>
            </CardContent>
          </Card>

          {/* Custom Snack */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {t('mealPlan:addSnackDialog.customSnack')}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="snack-name">{t('mealPlan:addSnackDialog.snackName')}</Label>
                  <Input
                    id="snack-name"
                    value={customSnack.name}
                    onChange={(e) => setCustomSnack({...customSnack, name: e.target.value})}
                    placeholder="e.g., Apple with peanut butter"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="calories">{t('common:calories')}</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={customSnack.calories}
                      onChange={(e) => setCustomSnack({...customSnack, calories: e.target.value})}
                      placeholder="200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="protein">{t('common:protein')} (g)</Label>
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
                    <Label htmlFor="carbs">{t('common:carbs')} (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      value={customSnack.carbs}
                      onChange={(e) => setCustomSnack({...customSnack, carbs: e.target.value})}
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fat">{t('common:fat')} (g)</Label>
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
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('mealPlan:addSnackDialog.addCustomSnack')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSnackDialog;


import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import AddSnackHeader from "./add-snack/AddSnackHeader";
import CalorieProgressCard from "./add-snack/CalorieProgressCard";
import TargetReachedState from "./add-snack/TargetReachedState";
import SnackGenerationSection from "./add-snack/SnackGenerationSection";

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

  const remainingCalories = Math.max(0, targetDayCalories - currentDayCalories);

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
      console.log('🍎 Generating AI snack with params:', {
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
        console.error('❌ Error generating AI snack:', error);
        toast.error(t('addSnack.error'));
        return;
      }

      console.log('✅ AI snack generated successfully:', data);
      toast.success(t('addSnack.success'));
      onSnackAdded();
      onClose();
      
    } catch (error) {
      console.error('❌ Error generating AI snack:', error);
      toast.error(t('addSnack.error'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-lg mx-4 sm:mx-auto ${isRTL ? 'text-right' : 'text-left'}`}>
        <AddSnackHeader selectedDay={selectedDay} />
        
        <div className="space-y-6">
          <CalorieProgressCard 
            currentDayCalories={currentDayCalories}
            targetDayCalories={targetDayCalories}
          />

          {remainingCalories < 50 ? (
            <TargetReachedState onClose={onClose} />
          ) : (
            <SnackGenerationSection
              remainingCalories={remainingCalories}
              isGenerating={isGenerating}
              onGenerate={handleGenerateAISnack}
              onCancel={onClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSnackDialog;

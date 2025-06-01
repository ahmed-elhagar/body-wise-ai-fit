import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useI18n } from "@/hooks/useI18n";
import AddSnackHeader from "@/components/add-snack/AddSnackHeader";
import CalorieProgressCard from "@/components/add-snack/CalorieProgressCard";
import SnackFeatures from "@/components/add-snack/SnackFeatures";
import SnackGenerationSection from "@/components/add-snack/SnackGenerationSection";
import TargetReachedState from "@/components/add-snack/TargetReachedState";
import SnackGenerationProgress from "@/components/add-snack/SnackGenerationProgress";

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
  const { t, isRTL } = useI18n();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  const remainingCalories = Math.max(0, targetDayCalories - currentDayCalories);
  const isTargetReached = remainingCalories < 50;

  const handleGenerateSnack = async () => {
    if (!weeklyPlanId) return;
    
    setIsGenerating(true);
    setGenerationStep('analyzing');
    
    // Simulate API call with steps
    setTimeout(() => setGenerationStep('creating'), 1500);
    setTimeout(() => {
      setGenerationStep('saving');
      setTimeout(() => {
        setIsGenerating(false);
        onSnackAdded();
        onClose();
      }, 1000);
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AddSnackHeader selectedDay={selectedDay} />
        
        <div className="space-y-6">
          {isTargetReached ? (
            <TargetReachedState onClose={onClose} />
          ) : isGenerating ? (
            <SnackGenerationProgress step={generationStep} />
          ) : (
            <>
              <CalorieProgressCard
                currentDayCalories={currentDayCalories}
                targetDayCalories={targetDayCalories}
              />
              
              <SnackFeatures remainingCalories={remainingCalories} />
              
              <SnackGenerationSection
                remainingCalories={remainingCalories}
                isGenerating={isGenerating}
                onGenerate={handleGenerateSnack}
                onCancel={onClose}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSnackDialog;

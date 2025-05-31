
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { AddSnackDialogHeader } from "./add-snack/AddSnackDialogHeader";
import { DailyProgressCard } from "./add-snack/DailyProgressCard";
import { SnackGenerationProgress } from "./add-snack/SnackGenerationProgress";
import { TargetReachedCard } from "./add-snack/TargetReachedCard";
import { SnackGenerationCard } from "./add-snack/SnackGenerationCard";
import { useSnackGeneration } from "./add-snack/useSnackGeneration";
import { useCalorieCalculations } from "./add-snack/useCalorieCalculations";

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

  const { dynamicTargetCalories, remainingCalories, progressPercentage } = useCalorieCalculations(
    currentDayCalories,
    targetDayCalories
  );

  const { isGenerating, generationStep, handleGenerateAISnack } = useSnackGeneration({
    weeklyPlanId,
    selectedDay,
    remainingCalories,
    profile,
    onSnackAdded,
    onClose
  });

  const handleClose = () => {
    if (isGenerating) return; // Prevent closing during generation
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-2xl mx-4 sm:mx-auto bg-gradient-to-br from-fitness-accent-25 to-fitness-primary-25 border-fitness-accent-200 shadow-2xl rounded-2xl"
      >
        <DialogHeader className="pb-4">
          <AddSnackDialogHeader 
            selectedDay={selectedDay}
            isGenerating={isGenerating}
            onClose={handleClose}
          />
        </DialogHeader>
        
        <div className="space-y-6 pb-2">
          <DailyProgressCard
            selectedDay={selectedDay}
            currentDayCalories={currentDayCalories}
            dynamicTargetCalories={dynamicTargetCalories}
            remainingCalories={remainingCalories}
            progressPercentage={progressPercentage}
          />

          {isGenerating ? (
            <SnackGenerationProgress generationStep={generationStep} />
          ) : remainingCalories < 50 ? (
            <TargetReachedCard onClose={handleClose} />
          ) : (
            <SnackGenerationCard
              remainingCalories={remainingCalories}
              isGenerating={isGenerating}
              onGenerate={handleGenerateAISnack}
              onClose={handleClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedAddSnackDialog;

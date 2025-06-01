import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useI18n } from "@/hooks/useI18n";
import AddSnackHeader from "./add-snack/AddSnackHeader";
import CalorieProgressCard from "./add-snack/CalorieProgressCard";
import SnackGenerationSection from "./add-snack/SnackGenerationSection";
import TargetReachedState from "./add-snack/TargetReachedState";
import SnackGenerationProgress from "./add-snack/SnackGenerationProgress";
import { useAddSnack } from "@/hooks/useAddSnack";

interface AddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  weeklyPlanId: string | null;
  onSnackAdded: () => void;
  currentDayCalories: number;
  targetDayCalories: number;
}

const AddSnackDialog = ({ isOpen, onClose, selectedDay, weeklyPlanId, onSnackAdded, currentDayCalories, targetDayCalories }: AddSnackDialogProps) => {
  const { t, isRTL } = useI18n();
  const {
    remainingCalories,
    isGenerating,
    generatedSnack,
    generateSnack,
    resetSnack,
    addSnackToMealPlan
  } = useAddSnack(selectedDay, weeklyPlanId, currentDayCalories, targetDayCalories);

  useEffect(() => {
    if (!isOpen) {
      resetSnack();
    }
  }, [isOpen, resetSnack]);

  const handleGenerate = async () => {
    await generateSnack();
  };

  const handleCancel = () => {
    resetSnack();
  };

  const handleAddSnack = async () => {
    if (generatedSnack) {
      await addSnackToMealPlan(generatedSnack);
      onSnackAdded();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <AddSnackHeader selectedDay={selectedDay} />

        <CalorieProgressCard
          currentDayCalories={currentDayCalories}
          targetDayCalories={targetDayCalories}
          remainingCalories={remainingCalories}
        />

        {generatedSnack ? (
          <TargetReachedState
            snack={generatedSnack}
            onAddSnack={handleAddSnack}
            onCancel={handleCancel}
          />
        ) : isGenerating ? (
          <SnackGenerationProgress step="generating" />
        ) : (
          <SnackGenerationSection
            remainingCalories={remainingCalories}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddSnackDialog;

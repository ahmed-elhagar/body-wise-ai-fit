
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, Utensils } from "lucide-react";

interface MealPlanAILoadingDialogProps {
  isGenerating: boolean;
  onClose: () => void;
  position?: string;
}

export const MealPlanAILoadingDialog = ({ isGenerating, onClose, position }: MealPlanAILoadingDialogProps) => {
  return (
    <Dialog open={isGenerating} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="flex flex-col items-center space-y-4 py-6">
          <div className="relative">
            <Utensils className="w-12 h-12 text-primary" />
            <Loader2 className="w-6 h-6 animate-spin absolute -top-1 -right-1 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Generating Your Meal Plan</h3>
            <p className="text-gray-600">Please wait while we create your personalized meals...</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

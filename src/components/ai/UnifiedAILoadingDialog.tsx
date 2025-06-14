
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export interface AIStep {
  id: string;
  title: string;
  label: string;
  description: string;
  estimatedDuration: number;
}

interface UnifiedAILoadingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  steps: AIStep[];
  currentStepIndex: number;
  position?: "center" | "top-right";
  isComplete?: boolean;
  progress?: number;
}

export const UnifiedAILoadingDialog = ({
  isOpen,
  onClose,
  title,
  description,
  steps,
  currentStepIndex,
  position = "center",
  isComplete = false,
  progress = 0
}: UnifiedAILoadingDialogProps) => {
  const currentStep = steps[currentStepIndex];
  const progressPercentage = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : progress;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{description}</p>
          
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-gray-500 text-center">
              {Math.round(progressPercentage)}% complete
            </p>
          </div>
          
          {currentStep && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-900">{currentStep.title || currentStep.label}</h4>
              <p className="text-sm text-blue-700">{currentStep.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};


import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface AIStep {
  id: string;
  title: string;
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
}

const UnifiedAILoadingDialog = ({
  isOpen,
  onClose,
  title,
  description,
  steps,
  currentStepIndex,
  position = "center"
}: UnifiedAILoadingDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={position === "top-right" ? "fixed top-4 right-4 max-w-md" : ""}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">{description}</p>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-3 rounded-lg border ${
                  index === currentStepIndex
                    ? "bg-blue-50 border-blue-200"
                    : index < currentStepIndex
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {index < currentStepIndex ? (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  ) : index === currentStepIndex ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  ) : (
                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                  )}
                  <span className="font-medium">{step.title}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { UnifiedAILoadingDialog };
export type { AIStep, UnifiedAILoadingDialogProps };
export default UnifiedAILoadingDialog;

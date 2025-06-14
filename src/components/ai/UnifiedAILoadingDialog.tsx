
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles } from "lucide-react";

interface UnifiedAILoadingDialogProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  progress?: number;
  currentStep?: string;
}

const UnifiedAILoadingDialog = ({
  isOpen,
  title = "AI Processing",
  description = "Please wait while we process your request...",
  progress = 0,
  currentStep
}: UnifiedAILoadingDialogProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center space-y-4 py-8">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 absolute -bottom-1 -right-1" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
            {currentStep && (
              <p className="text-xs text-blue-600 font-medium">{currentStep}</p>
            )}
          </div>
          
          <div className="w-full">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500 text-center mt-2">{progress}% complete</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedAILoadingDialog;

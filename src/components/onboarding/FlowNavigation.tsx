
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface FlowNavigationProps {
  step: number;
  totalSteps: number;
  isStepValid: boolean;
  isProcessing: boolean;
  canSkip: boolean;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

const FlowNavigation = ({ 
  step, 
  totalSteps, 
  isStepValid, 
  isProcessing, 
  canSkip,
  onBack, 
  onNext,
  onSkip
}: FlowNavigationProps) => {
  const getNextButtonText = () => {
    if (step === totalSteps) return 'Complete Setup';
    return 'Continue';
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t gap-4 sm:gap-0">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={step === 1 || isProcessing}
        className="flex items-center space-x-2 w-full sm:w-auto order-2 sm:order-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Button>

      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto order-1 sm:order-2">
        {canSkip && (
          <Button
            variant="ghost"
            onClick={onSkip}
            disabled={isProcessing}
            className="text-gray-500 hover:text-gray-700 w-full sm:w-auto"
          >
            Skip
          </Button>
        )}

        <Button
          onClick={onNext}
          disabled={isProcessing || (!isStepValid && !canSkip)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center space-x-2 w-full sm:w-auto"
        >
          <span>{getNextButtonText()}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default FlowNavigation;


import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

interface SignupNavigationProps {
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
  canSkip?: boolean;
  onSkip?: () => void;
}

const SignupNavigation = ({ 
  currentStep, 
  totalSteps, 
  isStepValid, 
  isLoading, 
  onBack, 
  onNext,
  onComplete,
  canSkip = false,
  onSkip
}: SignupNavigationProps) => {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentStep === 1 || isLoading}
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Button>

      <div className="flex items-center space-x-3">
        {canSkip && (
          <Button
            variant="ghost"
            onClick={onSkip}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700"
          >
            Skip for now
          </Button>
        )}

        <Button
          onClick={isLastStep ? onComplete : onNext}
          disabled={isLoading || (!isStepValid && !canSkip)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center space-x-2 min-w-[140px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>{isLastStep ? 'Complete Setup' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SignupNavigation;


import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

interface ModernOnboardingNavigationProps {
  step: number;
  totalSteps: number;
  isStepValid: boolean;
  isUpdating: boolean;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  canSkip?: boolean;
}

const ModernOnboardingNavigation = ({ 
  step, 
  totalSteps, 
  isStepValid, 
  isUpdating, 
  onBack, 
  onNext,
  onSkip,
  canSkip = false
}: ModernOnboardingNavigationProps) => {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={step === 1 || isUpdating}
        className="flex items-center space-x-2"
        data-testid="previous-step"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Button>

      <div className="flex items-center space-x-3">
        {canSkip && (
          <Button
            variant="ghost"
            onClick={onSkip}
            disabled={isUpdating}
            className="text-gray-500 hover:text-gray-700"
          >
            Skip for now
          </Button>
        )}

        <Button
          onClick={onNext}
          disabled={isUpdating || !isStepValid}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center space-x-2 min-w-[120px]"
          data-testid={step === totalSteps ? "finish-onboarding" : "next-step"}
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>{step === totalSteps ? 'Complete Setup' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ModernOnboardingNavigation;

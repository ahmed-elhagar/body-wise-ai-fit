
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface SignupNavigationProps {
  step: number;
  totalSteps: number;
  isStepValid: boolean;
  isUpdating: boolean;
  canSkip: boolean;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

const SignupNavigation = ({ 
  step, 
  totalSteps, 
  isStepValid, 
  isUpdating, 
  canSkip,
  onBack, 
  onNext,
  onSkip
}: SignupNavigationProps) => {
  const getNextButtonText = () => {
    if (step === 1) return 'Create Account';
    if (step === totalSteps) return 'Complete Setup';
    return 'Continue';
  };

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={step === 1 || isUpdating}
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
            disabled={isUpdating}
            className="text-gray-500 hover:text-gray-700"
          >
            Skip
          </Button>
        )}

        <Button
          onClick={onNext}
          disabled={isUpdating || (!isStepValid && !canSkip)}
          className="bg-fitness-gradient hover:opacity-90 text-white flex items-center space-x-2"
        >
          <span>{getNextButtonText()}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SignupNavigation;


import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, SkipForward } from "lucide-react";

interface ModernOnboardingNavigationProps {
  step: number;
  totalSteps: number;
  isStepValid: boolean;
  isUpdating: boolean;
  canSkip?: boolean;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
}

const ModernOnboardingNavigation = ({ 
  step, 
  totalSteps, 
  isStepValid, 
  isUpdating, 
  canSkip = false,
  onBack, 
  onNext,
  onSkip
}: ModernOnboardingNavigationProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={onBack}
        disabled={step === 1}
        className="w-full sm:w-auto flex items-center gap-2 h-11 px-6"
        data-testid="back-step"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Button>

      {/* Skip Button (if applicable) */}
      {canSkip && onSkip && (
        <Button
          variant="ghost"
          onClick={onSkip}
          disabled={isUpdating}
          className="w-full sm:w-auto flex items-center gap-2 h-11 px-6 text-gray-500 hover:text-gray-700"
          data-testid="skip-step"
        >
          <SkipForward className="w-4 h-4" />
          <span>Skip for now</span>
        </Button>
      )}

      {/* Next/Complete Button */}
      <Button
        onClick={onNext}
        disabled={isUpdating || (!isStepValid && !canSkip)}
        className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white flex items-center gap-2 h-11 px-6"
        data-testid={step === totalSteps ? "finish-onboarding" : "next-step"}
      >
        <span>{step === totalSteps ? 'Complete Setup' : 'Continue'}</span>
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ModernOnboardingNavigation;

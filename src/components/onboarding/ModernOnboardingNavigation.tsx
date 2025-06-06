
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, SkipForward, Sparkles } from "lucide-react";

interface ModernOnboardingNavigationProps {
  step: number;
  totalSteps: number;
  isStepValid: boolean;
  isUpdating: boolean;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  canSkip: boolean;
}

const ModernOnboardingNavigation = ({ 
  step, 
  totalSteps, 
  isStepValid, 
  isUpdating, 
  onBack, 
  onNext,
  onSkip,
  canSkip
}: ModernOnboardingNavigationProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={onBack}
        disabled={step === 1}
        className="w-full sm:w-auto flex items-center gap-2 h-12 px-6 border-2 border-gray-200 hover:border-gray-300 transition-colors rounded-xl disabled:opacity-50"
        data-testid="previous-step"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Button>

      {/* Skip and Next Button Container */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {canSkip && (
          <Button
            variant="ghost"
            onClick={onSkip}
            className="flex items-center gap-2 h-12 px-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors rounded-xl"
          >
            <SkipForward className="w-4 h-4" />
            <span className="hidden sm:inline">Skip</span>
          </Button>
        )}

        {/* Next/Complete Button */}
        <Button
          onClick={onNext}
          disabled={isUpdating || !isStepValid}
          className={`flex items-center gap-2 h-12 px-6 text-white font-semibold transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex-1 sm:flex-initial ${
            step === totalSteps 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
          }`}
          data-testid={step === totalSteps ? "finish-onboarding" : "next-step"}
        >
          {isUpdating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span className="text-sm sm:text-base">
                {step === totalSteps ? 'Complete Setup' : 'Continue'}
              </span>
              {step === totalSteps ? (
                <Sparkles className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ModernOnboardingNavigation;

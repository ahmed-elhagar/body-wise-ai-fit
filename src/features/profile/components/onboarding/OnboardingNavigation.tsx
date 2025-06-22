
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingNavigationProps {
  step: number;
  totalSteps: number;
  isStepValid: boolean;
  isUpdating: boolean;
  onBack: () => void;
  onNext: () => void;
}

const OnboardingNavigation = ({ 
  step, 
  totalSteps, 
  isStepValid, 
  isUpdating, 
  onBack, 
  onNext 
}: OnboardingNavigationProps) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={step === 1}
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Button>

      <Button
        onClick={onNext}
        disabled={isUpdating || !isStepValid}
        className="bg-fitness-gradient hover:opacity-90 text-white flex items-center space-x-2"
      >
        <span>{step === totalSteps ? 'Complete Setup' : 'Next'}</span>
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default OnboardingNavigation;

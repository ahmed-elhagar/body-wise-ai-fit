
import { Progress } from "@/components/ui/progress";
import { SIGNUP_STEPS } from "./types";

interface SignupProgressProps {
  currentStep: number;
  setCurrentStep?: (step: number) => void;
}

const SignupProgress = ({ currentStep, setCurrentStep }: SignupProgressProps) => {
  const progress = (currentStep / SIGNUP_STEPS.length) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">Join FitFatta</h1>
        <span className="text-sm text-gray-600">
          Step {currentStep} of {SIGNUP_STEPS.length}
        </span>
      </div>
      
      <div className="space-y-2">
        <Progress value={progress} className="w-full h-2" />
        <p className="text-xs text-gray-500">
          {Math.round(progress)}% complete
        </p>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {SIGNUP_STEPS[currentStep - 1]?.title}
        </h2>
        <p className="text-sm text-gray-600">
          {SIGNUP_STEPS[currentStep - 1]?.description}
        </p>
      </div>
    </div>
  );
};

export default SignupProgress;

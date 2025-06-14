
import { Progress } from "@/components/ui/progress";

interface OnboardingHeaderProps {
  step: number;
  totalSteps: number;
  progress: number;
}

const OnboardingHeader = ({ step, totalSteps, progress }: OnboardingHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Complete Your Profile</h1>
        <span className="text-sm text-gray-600">Step {step} of {totalSteps}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default OnboardingHeader;

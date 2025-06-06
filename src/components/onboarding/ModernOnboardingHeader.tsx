
import { Progress } from "@/components/ui/progress";

interface ModernOnboardingHeaderProps {
  step: number;
  totalSteps: number;
  progress: number;
}

const ModernOnboardingHeader = ({ step, totalSteps, progress }: ModernOnboardingHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to FitGenius
        </h1>
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          Step {step} of {totalSteps}
        </span>
      </div>
      <Progress value={progress} className="h-3 bg-gray-200" />
      <p className="text-sm text-gray-500 mt-2">
        Complete your profile to get personalized recommendations
      </p>
    </div>
  );
};

export default ModernOnboardingHeader;

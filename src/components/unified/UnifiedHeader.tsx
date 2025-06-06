
import { Progress } from "@/components/ui/progress";

interface UnifiedHeaderProps {
  step: number;
  totalSteps: number;
  progress: number;
}

const UnifiedHeader = ({ step, totalSteps, progress }: UnifiedHeaderProps) => {
  const getStepTitle = (currentStep: number) => {
    switch (currentStep) {
      case 1: return "Create Your Account";
      case 2: return "Basic Information";
      case 3: return "Body Composition";
      case 4: return "Goals & Activity";
      case 5: return "Health & Preferences";
      case 6: return "Special Conditions";
      default: return "Setup";
    }
  };

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold bg-fitness-gradient bg-clip-text text-transparent mb-2">
          Welcome to FitFatta
        </h1>
        <p className="text-gray-600">Your AI-powered fitness journey starts here</p>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">{getStepTitle(step)}</h2>
        <span className="text-sm text-gray-600">Step {step} of {totalSteps}</span>
      </div>
      
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default UnifiedHeader;

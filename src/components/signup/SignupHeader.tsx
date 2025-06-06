
import { Progress } from "@/components/ui/progress";

interface SignupHeaderProps {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
}

const SignupHeader = ({ step, totalSteps, title, description }: SignupHeaderProps) => {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold bg-fitness-gradient bg-clip-text text-transparent mb-2">
          FitFatta
        </h1>
        <p className="text-gray-600">Your AI-powered fitness companion</p>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <span className="text-sm text-gray-600">Step {step} of {totalSteps}</span>
      </div>
      
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default SignupHeader;

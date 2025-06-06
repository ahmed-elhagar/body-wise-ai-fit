
import { Progress } from "@/components/ui/progress";

interface FlowHeaderProps {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
}

const FlowHeader = ({ step, totalSteps, title, description }: FlowHeaderProps) => {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="w-full mb-6 sm:mb-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          FitGenius
        </h1>
        <p className="text-sm sm:text-base text-gray-600">Your AI-powered fitness companion</p>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h2>
          <p className="text-xs sm:text-sm text-gray-600">{description}</p>
        </div>
        <span className="text-xs sm:text-sm text-gray-600 font-medium">
          Step {step} of {totalSteps}
        </span>
      </div>
      
      <Progress value={progress} className="h-2 sm:h-3" />
    </div>
  );
};

export default FlowHeader;

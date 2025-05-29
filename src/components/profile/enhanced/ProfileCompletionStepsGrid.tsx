
import { CheckCircle, Circle } from "lucide-react";

interface ProfileCompletionStepsGridProps {
  steps: any[];
  onStepClick: (step: string) => void;
}

const ProfileCompletionStepsGrid = ({ steps, onStepClick }: ProfileCompletionStepsGridProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-3">
      {steps.map((step, index) => (
        <button
          key={step.key}
          onClick={() => onStepClick(step.key)}
          className={`p-3 rounded-lg border transition-all duration-200 text-left hover:shadow-md ${
            step.completed 
              ? 'bg-green-50 border-green-200 hover:bg-green-100' 
              : 'bg-white/60 border-gray-200 hover:bg-white/80'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            {step.completed ? (
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
            <span className="text-xs font-medium text-gray-700">
              {index + 1}
            </span>
          </div>
          <p className={`text-xs font-medium line-clamp-2 ${
            step.completed ? 'text-green-800' : 'text-gray-700'
          }`}>
            {step.title}
          </p>
        </button>
      ))}
    </div>
  );
};

export default ProfileCompletionStepsGrid;

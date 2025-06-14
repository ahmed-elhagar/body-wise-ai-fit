
export interface AIStep {
  id: string;
  title: string;
  description?: string;
  estimatedDuration?: number;
  status?: 'pending' | 'active' | 'completed' | 'error';
}

interface AILoadingStepsProps {
  steps: AIStep[];
  currentStepIndex: number;
  isComplete: boolean;
}

const AILoadingSteps = ({ steps, currentStepIndex, isComplete }: AILoadingStepsProps) => {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isCompleted = index < currentStepIndex || isComplete;
        
        return (
          <div key={step.id} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
              isCompleted ? 'bg-green-500 text-white' :
              isActive ? 'bg-blue-500 text-white' :
              'bg-gray-200 text-gray-500'
            }`}>
              {isCompleted ? '✓' : index + 1}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                isActive ? 'text-blue-600' : 
                isCompleted ? 'text-green-600' : 
                'text-gray-500'
              }`}>
                {step.title}
              </p>
              {step.description && (
                <p className="text-xs text-gray-500">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AILoadingSteps;

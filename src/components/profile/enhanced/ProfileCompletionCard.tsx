
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Target } from "lucide-react";
import { useProfileCompletionSteps } from "./profileCompletionSteps";
import { useEnhancedProfile } from "@/hooks/useEnhancedProfile";

interface ProfileCompletionCardProps {
  onStepClick: (step: string) => void;
}

const ProfileCompletionCard = ({ onStepClick }: ProfileCompletionCardProps) => {
  const { completionPercentage } = useEnhancedProfile();
  const { steps, nextIncompleteStep, completedSteps } = useProfileCompletionSteps(completionPercentage);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Profile Completion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <p className="text-xs text-gray-600">
            {completedSteps} of {steps.length} sections completed
          </p>
        </div>

        <div className="space-y-2">
          {steps.map((step) => (
            <Button
              key={step.key}
              variant={step.completed ? "outline" : "default"}
              className={`
                w-full justify-start h-auto p-3 text-left
                ${step.completed 
                  ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                  : nextIncompleteStep?.key === step.key
                    ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }
              `}
              onClick={() => onStepClick(step.key)}
            >
              <div className="flex items-center gap-3">
                {step.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm ${
                    step.completed ? 'text-green-800' : 'text-gray-800'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {step.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        {nextIncompleteStep && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">
              Next: {nextIncompleteStep.title}
            </p>
            <p className="text-xs text-blue-600">
              {nextIncompleteStep.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionCard;

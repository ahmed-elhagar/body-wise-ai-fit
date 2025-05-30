
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Target, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useProfileCompletionSteps } from "./profileCompletionSteps";
import { useEnhancedProfile } from "@/hooks/useEnhancedProfile";

interface CompactProfileCompletionCardProps {
  onStepClick: (step: string) => void;
}

const CompactProfileCompletionCard = ({ onStepClick }: CompactProfileCompletionCardProps) => {
  const { completionPercentage } = useEnhancedProfile();
  const { steps, nextIncompleteStep, completedSteps } = useProfileCompletionSteps(completionPercentage);
  const [isExpanded, setIsExpanded] = useState(completionPercentage < 100);
  const isCompleted = completionPercentage >= 100;

  if (isCompleted && !isExpanded) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Profile Complete!</p>
                <p className="text-sm text-green-600">All sections completed</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="text-green-600 hover:text-green-700"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isCompleted ? "bg-green-50 border-green-200" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-800">
              {isCompleted ? "Profile Complete!" : "Profile Setup"}
            </span>
          </div>
          {isCompleted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-gray-600 hover:text-gray-700"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className={isCompleted ? "text-green-700" : "text-gray-600"}>
                Progress
              </span>
              <span className={isCompleted ? "text-green-700 font-medium" : "text-gray-700 font-medium"}>
                {completionPercentage}%
              </span>
            </div>
            <Progress 
              value={completionPercentage} 
              className={`h-2 ${isCompleted ? "bg-green-100" : ""}`}
            />
            <p className="text-xs text-gray-500">
              {completedSteps} of {steps.length} sections completed
            </p>
          </div>

          {!isCompleted && nextIncompleteStep && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">
                Next: {nextIncompleteStep.title}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStepClick(nextIncompleteStep.key)}
                className="mt-2 text-xs bg-white hover:bg-blue-50 border-blue-200"
              >
                Complete Now
              </Button>
            </div>
          )}

          {isCompleted && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {steps.map((step) => (
                <Button
                  key={step.key}
                  variant="outline"
                  size="sm"
                  onClick={() => onStepClick(step.key)}
                  className="text-xs bg-white hover:bg-green-50 border-green-200"
                >
                  {step.title}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactProfileCompletionCard;


import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfileCompletionScore } from "@/hooks/useProfileCompletionScore";
import { useProfileCompletionSteps } from "./profileCompletionSteps";
import ProfileCompletionStatus from "./ProfileCompletionStatus";
import ProfileCompletionStepsGrid from "./ProfileCompletionStepsGrid";

interface ProfileCompletionCardProps {
  onStepClick: (step: string) => void;
}

const ProfileCompletionCard = ({ onStepClick }: ProfileCompletionCardProps) => {
  const { t } = useLanguage();
  const { completionScore } = useProfileCompletionScore();
  const { steps, nextIncompleteStep, completedSteps } = useProfileCompletionSteps(completionScore);

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 overflow-hidden">
      <div className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Left side - Progress info */}
          <ProfileCompletionStatus
            completionScore={completionScore}
            completedSteps={completedSteps}
            totalSteps={steps.length}
            nextIncompleteStep={nextIncompleteStep}
          />

          {/* Right side - Steps grid */}
          <ProfileCompletionStepsGrid
            steps={steps}
            onStepClick={onStepClick}
          />

          {/* Action button */}
          {nextIncompleteStep && (
            <div className="lg:ml-4">
              <Button 
                onClick={() => onStepClick(nextIncompleteStep.key)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 w-full lg:w-auto"
              >
                {t('continue')} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileCompletionCard;

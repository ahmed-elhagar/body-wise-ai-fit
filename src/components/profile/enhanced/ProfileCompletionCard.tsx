
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";

interface ProfileCompletionCardProps {
  onStepClick: (step: string) => void;
}

const ProfileCompletionCard = ({ onStepClick }: ProfileCompletionCardProps) => {
  const { profile } = useProfile();
  const { progress } = useOnboardingProgress();

  const completionScore = profile?.profile_completion_score || 0;

  const steps = [
    {
      key: 'basic_info',
      title: 'Basic Information',
      description: 'Personal details and physical measurements',
      completed: progress?.basic_info_completed || false,
    },
    {
      key: 'health_assessment',
      title: 'Health Assessment',
      description: 'Health conditions, lifestyle, and wellness data',
      completed: progress?.health_assessment_completed || false,
    },
    {
      key: 'goals_setup',
      title: 'Goals & Objectives',
      description: 'Fitness goals and target achievements',
      completed: progress?.goals_setup_completed || false,
    },
    {
      key: 'preferences',
      title: 'Preferences',
      description: 'App settings and notification preferences',
      completed: progress?.preferences_completed || false,
    },
    {
      key: 'profile_review',
      title: 'Profile Review',
      description: 'Final review and confirmation',
      completed: progress?.profile_review_completed || false,
    },
  ];

  const nextIncompleteStep = steps.find(step => !step.completed);

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">Profile Completion</h3>
          <span className="text-2xl font-bold text-blue-600">{completionScore}%</span>
        </div>
        <Progress value={completionScore} className="h-3 mb-4" />
        
        {completionScore < 100 && nextIncompleteStep && (
          <div className="bg-white/60 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Next step:</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{nextIncompleteStep.title}</p>
                <p className="text-sm text-gray-600">{nextIncompleteStep.description}</p>
              </div>
              <Button 
                onClick={() => onStepClick(nextIncompleteStep.key)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <div 
            key={step.key}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
              step.completed 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-white/40 border border-gray-200 hover:bg-white/60'
            }`}
            onClick={() => onStepClick(step.key)}
          >
            {step.completed ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 mr-3" />
            )}
            <div className="flex-1">
              <p className={`font-medium ${step.completed ? 'text-green-800' : 'text-gray-700'}`}>
                {step.title}
              </p>
              <p className={`text-sm ${step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                {step.description}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
        ))}
      </div>

      {completionScore === 100 && (
        <div className="mt-4 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-green-800">Profile Complete!</p>
            <p className="text-sm text-green-600">You're all set to make the most of your fitness journey.</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProfileCompletionCard;

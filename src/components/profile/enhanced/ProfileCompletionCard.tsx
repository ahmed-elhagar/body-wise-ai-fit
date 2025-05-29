
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useHealthAssessment } from "@/hooks/useHealthAssessment";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";

interface ProfileCompletionCardProps {
  onStepClick: (step: string) => void;
}

const ProfileCompletionCard = ({ onStepClick }: ProfileCompletionCardProps) => {
  const { profile } = useProfile();
  const { assessment } = useHealthAssessment();
  const { progress } = useOnboardingProgress();

  // Calculate accurate completion score based on actual data
  const calculateCompletionScore = () => {
    let totalFields = 0;
    let completedFields = 0;

    // Basic Information (8 fields)
    const basicFields = ['first_name', 'last_name', 'age', 'gender', 'height', 'weight', 'nationality', 'body_shape'];
    basicFields.forEach(field => {
      totalFields++;
      if (profile?.[field as keyof typeof profile]) completedFields++;
    });

    // Goals & Activity (6 fields)
    const goalFields = ['fitness_goal', 'activity_level'];
    goalFields.forEach(field => {
      totalFields++;
      if (profile?.[field as keyof typeof profile]) completedFields++;
    });
    
    // Array fields
    totalFields += 4;
    if (profile?.health_conditions?.length) completedFields++;
    if (profile?.allergies?.length) completedFields++;
    if (profile?.preferred_foods?.length) completedFields++;
    if (profile?.dietary_restrictions?.length) completedFields++;

    // Health Assessment (14 fields)
    if (assessment) {
      const assessmentFields = [
        'chronic_conditions', 'medications', 'injuries', 'physical_limitations',
        'stress_level', 'sleep_quality', 'energy_level', 'work_schedule',
        'exercise_history', 'nutrition_knowledge', 'cooking_skills', 'time_availability',
        'primary_motivation', 'specific_goals', 'timeline_expectation', 'commitment_level'
      ];
      
      assessmentFields.forEach(field => {
        totalFields++;
        const value = assessment[field as keyof typeof assessment];
        if (Array.isArray(value) ? value.length > 0 : value) {
          completedFields++;
        }
      });
    } else {
      totalFields += 16; // Add assessment fields to total even if not completed
    }

    return Math.round((completedFields / totalFields) * 100);
  };

  const completionScore = calculateCompletionScore();

  const steps = [
    {
      key: 'basic_info',
      title: 'Basic Information',
      description: 'Personal details and physical measurements',
      completed: profile?.first_name && profile?.last_name && profile?.age && profile?.gender && 
                 profile?.height && profile?.weight && profile?.nationality,
    },
    {
      key: 'health_assessment',
      title: 'Health Assessment',
      description: 'Health conditions, lifestyle, and wellness data',
      completed: !!assessment && assessment.stress_level && assessment.sleep_quality && assessment.energy_level,
    },
    {
      key: 'goals_setup',
      title: 'Goals & Objectives',
      description: 'Fitness goals and target achievements',
      completed: profile?.fitness_goal && profile?.activity_level,
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
      completed: completionScore >= 80,
    },
  ];

  const nextIncompleteStep = steps.find(step => !step.completed);

  return (
    <Card className="p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base lg:text-lg font-semibold text-gray-800">Profile Completion</h3>
          <span className="text-xl lg:text-2xl font-bold text-blue-600">{completionScore}%</span>
        </div>
        <Progress value={completionScore} className="h-2 lg:h-3 mb-4" />
        
        {completionScore < 100 && nextIncompleteStep && (
          <div className="bg-white/60 rounded-lg p-3 lg:p-4 mb-4">
            <p className="text-xs lg:text-sm text-gray-600 mb-2">Next step:</p>
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm lg:text-base truncate">{nextIncompleteStep.title}</p>
                <p className="text-xs lg:text-sm text-gray-600 line-clamp-2">{nextIncompleteStep.description}</p>
              </div>
              <Button 
                onClick={() => onStepClick(nextIncompleteStep.key)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
              >
                Continue <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 lg:space-y-3">
        {steps.map((step) => (
          <div 
            key={step.key}
            className={`flex items-center p-2 lg:p-3 rounded-lg cursor-pointer transition-colors ${
              step.completed 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-white/40 border border-gray-200 hover:bg-white/60'
            }`}
            onClick={() => onStepClick(step.key)}
          >
            {step.completed ? (
              <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3 flex-shrink-0" />
            ) : (
              <Circle className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 mr-2 lg:mr-3 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-sm lg:text-base truncate ${step.completed ? 'text-green-800' : 'text-gray-700'}`}>
                {step.title}
              </p>
              <p className={`text-xs lg:text-sm line-clamp-2 ${step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                {step.description}
              </p>
            </div>
            <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400 flex-shrink-0" />
          </div>
        ))}
      </div>

      {completionScore === 100 && (
        <div className="mt-4 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-green-800 text-sm lg:text-base">Profile Complete!</p>
            <p className="text-xs lg:text-sm text-green-600">You're all set to make the most of your fitness journey.</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProfileCompletionCard;

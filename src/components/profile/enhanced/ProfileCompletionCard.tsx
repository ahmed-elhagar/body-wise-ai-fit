
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useHealthAssessment } from "@/hooks/useHealthAssessment";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileCompletionCardProps {
  onStepClick: (step: string) => void;
}

const ProfileCompletionCard = ({ onStepClick }: ProfileCompletionCardProps) => {
  const { profile } = useProfile();
  const { assessment } = useHealthAssessment();
  const { progress } = useOnboardingProgress();
  const { t } = useLanguage();

  // Centralized completion score calculation
  const calculateCompletionScore = () => {
    let totalFields = 0;
    let completedFields = 0;

    // Basic Information (8 required fields)
    const basicFields = ['first_name', 'last_name', 'age', 'gender', 'height', 'weight', 'nationality', 'body_shape'];
    basicFields.forEach(field => {
      totalFields++;
      const value = profile?.[field as keyof typeof profile];
      if (value !== null && value !== undefined && value !== '') {
        completedFields++;
      }
    });

    // Goals & Activity (6 fields - 2 required + 4 array fields)
    const goalFields = ['fitness_goal', 'activity_level'];
    goalFields.forEach(field => {
      totalFields++;
      const value = profile?.[field as keyof typeof profile];
      if (value && value !== '') {
        completedFields++;
      }
    });
    
    // Array fields for profile
    const arrayFields = ['health_conditions', 'allergies', 'preferred_foods', 'dietary_restrictions'];
    arrayFields.forEach(field => {
      totalFields++;
      const value = profile?.[field as keyof typeof profile] as string[];
      if (value && Array.isArray(value) && value.length > 0) {
        completedFields++;
      }
    });

    // Health Assessment (12 key fields)
    if (assessment) {
      const assessmentFields = [
        'stress_level', 'sleep_quality', 'energy_level', 'work_schedule',
        'exercise_history', 'nutrition_knowledge', 'cooking_skills', 'time_availability',
        'timeline_expectation', 'commitment_level'
      ];
      
      assessmentFields.forEach(field => {
        totalFields++;
        const value = assessment[field as keyof typeof assessment];
        if (value !== null && value !== undefined && value !== '') {
          completedFields++;
        }
      });

      // Assessment array fields
      const assessmentArrayFields = ['chronic_conditions', 'medications', 'primary_motivation', 'specific_goals'];
      assessmentArrayFields.forEach(field => {
        totalFields++;
        const value = assessment[field as keyof typeof assessment] as string[];
        if (value && Array.isArray(value) && value.length > 0) {
          completedFields++;
        }
      });
    } else {
      totalFields += 14; // Add assessment fields to total even if not completed
    }

    return Math.round((completedFields / totalFields) * 100);
  };

  const completionScore = calculateCompletionScore();

  const steps = [
    {
      key: 'basic_info',
      title: t('basicInformation'),
      description: t('personalDetailsAndMeasurements'),
      completed: profile?.first_name && profile?.last_name && profile?.age && profile?.gender && 
                 profile?.height && profile?.weight && profile?.nationality && profile?.body_shape,
    },
    {
      key: 'health_assessment',
      title: t('healthAssessment'),
      description: t('healthConditionsLifestyleData'),
      completed: !!assessment && 
                 assessment.stress_level !== null && 
                 assessment.sleep_quality !== null && 
                 assessment.energy_level !== null &&
                 assessment.work_schedule && 
                 assessment.exercise_history &&
                 assessment.commitment_level !== null,
    },
    {
      key: 'goals_setup',
      title: t('goalsObjectives'),
      description: t('fitnessGoalsTargetAchievements'),
      completed: profile?.fitness_goal && profile?.activity_level,
    },
    {
      key: 'preferences',
      title: t('preferences'),
      description: t('appSettingsNotificationPreferences'),
      completed: progress?.preferences_completed || false,
    },
    {
      key: 'profile_review',
      title: t('profileReview'),
      description: t('finalReviewConfirmation'),
      completed: completionScore >= 80,
    },
  ];

  const nextIncompleteStep = steps.find(step => !step.completed);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 overflow-hidden">
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{t('profileCompletion')}</h3>
            <span className="text-2xl font-bold text-blue-600">{completionScore}%</span>
          </div>
          <Progress value={completionScore} className="h-3 mb-4" />
          
          {completionScore < 100 && nextIncompleteStep && (
            <div className="bg-white/60 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600 mb-2">{t('nextStep')}:</p>
              <div className="space-y-2">
                <p className="font-medium text-gray-800 text-sm">{nextIncompleteStep.title}</p>
                <p className="text-xs text-gray-600">{nextIncompleteStep.description}</p>
                <Button 
                  onClick={() => onStepClick(nextIncompleteStep.key)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                >
                  {t('continue')} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {steps.map((step) => (
            <div 
              key={step.key}
              className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors ${
                step.completed 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-white/40 border border-gray-200 hover:bg-white/60'
              }`}
              onClick={() => onStepClick(step.key)}
            >
              <div className="flex-shrink-0 mt-0.5 mr-3">
                {step.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${step.completed ? 'text-green-800' : 'text-gray-700'}`}>
                  {step.title}
                </p>
                <p className={`text-xs ${step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                  {step.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
            </div>
          ))}
        </div>

        {completionScore === 100 && (
          <div className="mt-4 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-medium text-green-800">{t('profileComplete')}</p>
              <p className="text-sm text-green-600">{t('allSetForFitnessJourney')}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileCompletionCard;

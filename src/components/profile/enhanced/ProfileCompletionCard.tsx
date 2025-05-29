
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ArrowRight, Target } from "lucide-react";
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
  const completedSteps = steps.filter(step => step.completed).length;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 overflow-hidden">
      <div className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Left side - Progress info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{t('profileCompletion')}</h3>
                <p className="text-sm text-gray-600">{completedSteps} of {steps.length} steps completed</p>
              </div>
            </div>
            
            {completionScore < 100 && nextIncompleteStep && (
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-1">{t('nextStep')}:</p>
                <p className="font-medium text-gray-800 text-sm">{nextIncompleteStep.title}</p>
              </div>
            )}
            
            {completionScore === 100 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="font-medium text-green-800 text-sm">{t('profileComplete')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right side - Steps grid */}
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


import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Target, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfileCompletionScore } from "@/hooks/useProfileCompletionScore";
import { useProfileCompletionSteps } from "./profileCompletionSteps";

interface ProfileCompletionCardProps {
  onStepClick: (step: string) => void;
}

const ProfileCompletionCard = ({ onStepClick }: ProfileCompletionCardProps) => {
  const { t } = useLanguage();
  const { completionScore } = useProfileCompletionScore();
  const { steps, nextIncompleteStep, completedSteps } = useProfileCompletionSteps(completionScore);

  const getProgressColor = () => {
    if (completionScore >= 80) return "bg-green-500";
    if (completionScore >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getMotivationalMessage = () => {
    if (completionScore === 100) {
      return "🎉 Amazing! Your profile is complete and ready for AI recommendations!";
    }
    if (completionScore >= 75) {
      return "🚀 You're almost there! Just a few more steps to unlock full personalization.";
    }
    if (completionScore >= 50) {
      return "💪 Great progress! Keep going to get better AI recommendations.";
    }
    return "🌟 Let's complete your profile to unlock personalized AI features!";
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 overflow-hidden shadow-lg">
      <div className="p-4 lg:p-6">
        <div className="flex flex-col space-y-4">
          {/* Header with progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/80 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{t('profileCompletion')}</h3>
                <p className="text-sm text-gray-600">{completedSteps} of {steps.length} steps completed</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{completionScore}%</div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <Progress value={completionScore} className="h-3" />
            <p className="text-sm text-center text-gray-600 font-medium">
              {getMotivationalMessage()}
            </p>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {steps.map((step, index) => (
              <button
                key={step.key}
                onClick={() => onStepClick(step.key)}
                className={`p-3 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-md hover:scale-105 ${
                  step.completed 
                    ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                    : nextIncompleteStep?.key === step.key
                    ? 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100 ring-2 ring-yellow-200'
                    : 'bg-white/70 border-gray-200 hover:bg-white/90'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {step.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : nextIncompleteStep?.key === step.key ? (
                    <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 animate-pulse" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                  )}
                  <span className="text-xs font-bold text-gray-700">
                    {index + 1}
                  </span>
                </div>
                <p className={`text-xs font-medium line-clamp-2 ${
                  step.completed ? 'text-green-800' : 
                  nextIncompleteStep?.key === step.key ? 'text-yellow-800' : 
                  'text-gray-700'
                }`}>
                  {step.title}
                </p>
                {nextIncompleteStep?.key === step.key && (
                  <div className="mt-1 text-xs text-yellow-700 font-medium">
                    Next step
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Action button */}
          {nextIncompleteStep && (
            <div className="pt-2">
              <Button 
                onClick={() => onStepClick(nextIncompleteStep.key)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span>Continue: {nextIncompleteStep.title}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {completionScore === 100 && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-bold text-green-800">{t('profileComplete')}</p>
                  <p className="text-sm text-green-700">
                    Your profile is now optimized for AI-powered personalized recommendations!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileCompletionCard;

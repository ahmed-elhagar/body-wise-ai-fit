
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Target, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useProfileCompletionSteps } from "./profileCompletionSteps";
import { useEnhancedProfile } from "@/hooks/useEnhancedProfile";
import { useLanguage } from "@/contexts/LanguageContext";

interface CompactProfileCompletionCardProps {
  onStepClick: (step: string) => void;
}

const CompactProfileCompletionCard = ({ onStepClick }: CompactProfileCompletionCardProps) => {
  const { completionPercentage } = useEnhancedProfile();
  const { steps, nextIncompleteStep, completedSteps } = useProfileCompletionSteps(completionPercentage);
  const [isExpanded, setIsExpanded] = useState(completionPercentage < 100);
  const { t, isRTL } = useLanguage();
  const isCompleted = completionPercentage >= 100;

  if (isCompleted && !isExpanded) {
    return (
      <Card className={`bg-green-50 border-green-200 ${isRTL ? 'rtl' : 'ltr'}`}>
        <CardContent className="p-3">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div className={isRTL ? 'text-right' : ''}>
                <p className={`text-sm font-medium text-green-800 ${isRTL ? 'font-arabic' : ''}`}>
                  {t('profile.profileComplete')}
                </p>
                <p className={`text-xs text-green-600 ${isRTL ? 'font-arabic' : ''}`}>
                  {t('profile.allSectionsCompleted')}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="text-green-600 hover:text-green-700 h-8 w-8 p-0"
            >
              <ChevronDown className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${isCompleted ? "bg-green-50 border-green-200" : ""} ${isRTL ? 'rtl' : 'ltr'}`}>
      <CardContent className="p-4">
        <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Target className="w-4 h-4 text-blue-600" />
            <span className={`text-sm font-medium text-gray-800 ${isRTL ? 'font-arabic' : ''}`}>
              {isCompleted ? t('profile.profileComplete') : t('profile.profileCompletion')}
            </span>
          </div>
          {isCompleted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-gray-600 hover:text-gray-700 h-8 w-8 p-0"
            >
              <ChevronUp className="w-3 h-3" />
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className={`flex justify-between text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className={`${isCompleted ? "text-green-700" : "text-gray-600"} ${isRTL ? 'font-arabic' : ''}`}>
                {t('progress')}
              </span>
              <span className={`${isCompleted ? "text-green-700 font-medium" : "text-gray-700 font-medium"}`}>
                {completionPercentage}%
              </span>
            </div>
            <Progress 
              value={completionPercentage} 
              className={`h-1.5 ${isCompleted ? "bg-green-100" : ""} ${isRTL ? 'scale-x-[-1]' : ''}`}
            />
            <p className={`text-xs text-gray-500 ${isRTL ? 'font-arabic text-right' : ''}`}>
              {completedSteps} {t('of')} {steps.length} {t('profile.sectionsCompleted')}
            </p>
          </div>

          {!isCompleted && nextIncompleteStep && (
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className={`text-xs text-blue-800 font-medium ${isRTL ? 'font-arabic text-right' : ''}`}>
                {t('profile.nextStep')}: {nextIncompleteStep.title}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStepClick(nextIncompleteStep.key)}
                className={`mt-1 text-xs h-6 bg-white hover:bg-blue-50 border-blue-200 ${isRTL ? 'font-arabic' : ''}`}
              >
                {t('profile.completeNow')}
              </Button>
            </div>
          )}

          {isCompleted && (
            <div className="grid grid-cols-2 gap-1">
              {steps.map((step) => (
                <Button
                  key={step.key}
                  variant="outline"
                  size="sm"
                  onClick={() => onStepClick(step.key)}
                  className={`text-xs h-6 bg-white hover:bg-green-50 border-green-200 ${isRTL ? 'font-arabic' : ''}`}
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


import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Brain, Target, Calendar, CheckCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

interface ExerciseProgramLoadingStatesProps {
  isGenerating: boolean;
  isLoading: boolean;
}

export const ExerciseProgramLoadingStates = ({ 
  isGenerating, 
  isLoading 
}: ExerciseProgramLoadingStatesProps) => {
  const { t, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const generationSteps = [
    {
      icon: Brain,
      title: t('exercise.analyzingProfile'),
      description: t('exercise.analyzingProfileDesc'),
      duration: 2000
    },
    {
      icon: Target,
      title: t('exercise.selectingExercises'),
      description: t('exercise.selectingExercisesDesc'),
      duration: 3000
    },
    {
      icon: Calendar,
      title: t('exercise.creatingSchedule'),
      description: t('exercise.creatingScheduleDesc'),
      duration: 2500
    },
    {
      icon: Dumbbell,
      title: t('exercise.finalizingProgram'),
      description: t('exercise.finalizingProgramDesc'),
      duration: 1500
    }
  ];

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    let stepIndex = 0;
    let progressValue = 0;
    const totalDuration = generationSteps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      progressValue = Math.min((elapsed / totalDuration) * 100, 95);
      setProgress(progressValue);

      // Update current step based on elapsed time
      let cumulativeDuration = 0;
      for (let i = 0; i < generationSteps.length; i++) {
        cumulativeDuration += generationSteps[i].duration;
        if (elapsed <= cumulativeDuration) {
          setCurrentStep(i);
          break;
        }
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isGenerating]);

  if (isGenerating) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-2xl text-center max-w-lg w-full mx-4">
          {/* Header */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Dumbbell className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h3 className={`text-2xl font-bold text-gray-800 mb-2 ${isRTL ? 'font-arabic' : ''}`}>
              {t('exercise.generatingProgram')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('exercise.generatingProgramDesc')}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className={`flex justify-between items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-sm font-medium text-gray-700">
                {t('exercise.progress')}
              </span>
              <span className="text-sm font-bold text-purple-600">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-600 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {generationSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div 
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 scale-105' 
                      : isCompleted 
                        ? 'bg-green-50 border-l-4 border-green-500' 
                        : 'bg-gray-50 opacity-60'
                  } ${isRTL ? 'flex-row-reverse border-r-4 border-l-0' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isActive 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : isActive ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>
                  <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h4 className={`font-semibold text-gray-800 ${isActive ? 'text-purple-700' : ''}`}>
                      {step.title}
                    </h4>
                    <p className={`text-sm text-gray-600 ${isActive ? 'text-purple-600' : ''}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-700 font-medium">
              {t('exercise.pleaseWait')}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
          <div className="w-12 h-12 animate-spin border-4 border-fitness-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">{t('exercise.loadingProgram')}</p>
        </Card>
      </div>
    );
  }

  return null;
};

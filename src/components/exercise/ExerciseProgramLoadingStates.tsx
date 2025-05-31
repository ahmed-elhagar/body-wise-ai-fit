
import LoadingIndicator from "@/components/ui/loading-indicator";
import AILoadingDialog from "@/components/ui/ai-loading-dialog";
import { Dumbbell, Brain, Target, Calendar } from "lucide-react";
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
      id: "analyzing",
      label: t('exercise.analyzingProfile'),
      icon: Brain,
      duration: 2000
    },
    {
      id: "selecting",
      label: t('exercise.selectingExercises'),
      icon: Target,
      duration: 3000
    },
    {
      id: "scheduling",
      label: t('exercise.creatingSchedule'),
      icon: Calendar,
      duration: 2500
    },
    {
      id: "finalizing",
      label: t('exercise.finalizingProgram'),
      icon: Dumbbell,
      duration: 1500
    }
  ];

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    const totalDuration = generationSteps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 95);
      setProgress(newProgress);

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
    const dialogSteps = generationSteps.map((step, index) => ({
      id: step.id,
      label: step.label,
      status: index < currentStep ? 'completed' as const : 
              index === currentStep ? 'active' as const : 'pending' as const
    }));

    return (
      <AILoadingDialog
        open={true}
        status="loading"
        title={t('exercise.generatingProgram')}
        message={generationSteps[currentStep]?.label || t('exercise.generatingProgram')}
        description={t('exercise.generatingProgramDesc')}
        steps={dialogSteps}
        progress={progress}
        allowClose={false}
      />
    );
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${isRTL ? 'rtl' : 'ltr'}`}>
        <LoadingIndicator
          status="loading"
          message={t('exercise.loadingProgram')}
          variant="card"
          size="lg"
        />
      </div>
    );
  }

  return null;
};


import PageLoadingOverlay from "@/components/ui/page-loading-overlay";
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
      label: 'Analyzing your fitness profile...',
      icon: Brain,
      duration: 2000
    },
    {
      id: "selecting",
      label: 'Selecting optimal exercises...',
      icon: Target,
      duration: 3000
    },
    {
      id: "scheduling",
      label: 'Creating workout schedule...',
      icon: Calendar,
      duration: 2500
    },
    {
      id: "finalizing",
      label: 'Finalizing your program...',
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
        title="Generating Exercise Program"
        message={generationSteps[currentStep]?.label || "Generating your program..."}
        description="Creating a personalized workout plan just for you"
        steps={dialogSteps}
        progress={progress}
        allowClose={false}
      />
    );
  }

  if (isLoading) {
    return (
      <PageLoadingOverlay
        isLoading={true}
        type="exercise"
        message="Loading Exercise Program"
        description="Fetching your workout data..."
      />
    );
  }

  return null;
};


import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import SimpleLoadingIndicator from "@/components/ui/simple-loading-indicator";

interface ExerciseProgramLoadingStatesProps {
  isGenerating: boolean;
  isLoading: boolean;
}

export const ExerciseProgramLoadingStates = ({ 
  isGenerating, 
  isLoading
}: ExerciseProgramLoadingStatesProps) => {
  const { isRTL } = useLanguage();

  if (isGenerating) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isRTL ? 'rtl' : 'ltr'}`}>
        <SimpleLoadingIndicator
          message="Generating Exercise Program"
          description="Creating your personalized workout plan..."
          size="lg"
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isRTL ? 'rtl' : 'ltr'}`}>
        <SimpleLoadingIndicator
          message="Loading Exercise Program"
          description="Please wait while we fetch your workout plan..."
          size="lg"
        />
      </div>
    );
  }

  return null;
};

export default ExerciseProgramLoadingStates;

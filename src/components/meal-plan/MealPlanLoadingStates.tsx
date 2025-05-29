
import MealPlanLoadingScreen from "@/components/MealPlanLoadingScreen";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealPlanLoadingStatesProps {
  isGenerating: boolean;
  isShuffling: boolean;
  isLoading: boolean;
}

const MealPlanLoadingStates = ({ 
  isGenerating, 
  isShuffling, 
  isLoading 
}: MealPlanLoadingStatesProps) => {
  const { t } = useLanguage();

  // Show loading state during generation OR shuffling
  if (isGenerating) {
    return <MealPlanLoadingScreen message={t('generating')} />;
  }

  if (isShuffling) {
    return <MealPlanLoadingScreen message="Shuffling your meals across the week..." />;
  }

  // Show loading state while fetching data
  if (isLoading) {
    return <MealPlanLoadingScreen message={t('loading')} />;
  }

  return null;
};

export default MealPlanLoadingStates;


import SimpleLoadingIndicator from "@/components/ui/simple-loading-indicator";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface SnackGenerationProgressProps {
  step: string;
}

const SnackGenerationProgress = ({ step }: SnackGenerationProgressProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <SimpleLoadingIndicator
        message={t('mealPlan.addSnack.generating') || "Generating AI Snack"}
        description="Creating the perfect snack for your remaining calories"
        size="lg"
        className="bg-white border-purple-200 text-purple-600"
      />
    </Card>
  );
};

export default SnackGenerationProgress;

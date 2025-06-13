
import { useLanguage } from "@/contexts/LanguageContext";
import FoodPhotoAnalysisCard from "@/components/food-photo-analysis/FoodPhotoAnalysisCard";
import FoodAnalysisResults from "@/components/food-photo-analysis/FoodAnalysisResults";
import { useFoodPhotoIntegration } from "@/hooks/useFoodPhotoIntegration";

interface FoodPhotoAnalyzerProps {
  onSelectFood?: (food: any) => void;
}

const FoodPhotoAnalyzer = ({ onSelectFood }: FoodPhotoAnalyzerProps) => {
  const { t } = useLanguage();
  const { 
    analysisResult, 
    convertToFoodItem 
  } = useFoodPhotoIntegration();

  const handleFoodSelected = (food: any) => {
    if (onSelectFood) {
      // Convert AI analysis to standardized food item format
      const standardizedFood = convertToFoodItem(food);
      console.log('🍕 Converting AI food analysis:', food, 'to standardized format:', standardizedFood);
      onSelectFood(standardizedFood);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t('AI Food Analysis')}
        </h2>
        <p className="text-gray-600">
          {t('Upload a photo of your food and get instant nutrition analysis. Analyzed foods can be added to your food tracker.')}
        </p>
      </div>

      {/* Photo Analysis Card */}
      <FoodPhotoAnalysisCard className="w-full" />

      {/* Analysis Results */}
      {analysisResult && (
        <FoodAnalysisResults
          result={analysisResult}
          onAddToLog={handleFoodSelected}
          className="w-full"
        />
      )}
    </div>
  );
};

export default FoodPhotoAnalyzer;

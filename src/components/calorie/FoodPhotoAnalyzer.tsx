
import { useI18n } from "@/hooks/useI18n";
import FoodPhotoAnalysisCard from "@/components/food-photo-analysis/FoodPhotoAnalysisCard";
import FoodAnalysisResults from "@/components/food-photo-analysis/FoodAnalysisResults";
import { useFoodPhotoIntegration } from "@/hooks/useFoodPhotoIntegration";

interface FoodPhotoAnalyzerProps {
  onSelectFood?: (food: any) => void;
}

const FoodPhotoAnalyzer = ({ onSelectFood }: FoodPhotoAnalyzerProps) => {
  const { t } = useI18n();
  const { 
    analysisResult, 
    convertToFoodItem,
    logAnalyzedFood 
  } = useFoodPhotoIntegration();

  const handleFoodSelected = (food: any) => {
    if (onSelectFood) {
      // Convert AI analysis to standardized food item format
      const standardizedFood = convertToFoodItem(food);
      onSelectFood(standardizedFood);
    }
  };

  const handleAddToLog = async (food: any) => {
    logAnalyzedFood(food, 100, 'snack', `Added from AI analysis`);
  };

  return (
    <div className="space-y-6">
      {/* Photo Analysis Card */}
      <FoodPhotoAnalysisCard 
        className="w-full"
      />

      {/* Analysis Results */}
      {analysisResult && (
        <FoodAnalysisResults
          result={analysisResult}
          onAddToLog={handleAddToLog}
          className="w-full"
        />
      )}
    </div>
  );
};

export default FoodPhotoAnalyzer;

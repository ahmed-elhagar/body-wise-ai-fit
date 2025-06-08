
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

  const handleAddToLog = async (food: any) => {
    // This would typically log the food to the user's tracker
    console.log('Adding food to log:', food);
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
      <div className="w-full">
        <FoodPhotoAnalysisCard />
      </div>

      {/* Analysis Results - Fixed props */}
      {analysisResult && (
        <div className="w-full">
          <FoodAnalysisResults 
            results={analysisResult} 
            onAddToLog={handleAddToLog}
          />
        </div>
      )}
    </div>
  );
};

export default FoodPhotoAnalyzer;

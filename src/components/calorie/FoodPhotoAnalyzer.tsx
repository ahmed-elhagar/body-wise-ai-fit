
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

      {/* Photo Analysis Card - Add missing prop */}
      <div className="w-full">
        {/* Temporary placeholder - the actual component needs to be implemented */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-gray-600">Food Photo Analysis Card - Component needs implementation</p>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="w-full">
          {/* Temporary placeholder - the actual component needs to be implemented */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-gray-600">Food Analysis Results - Component needs implementation</p>
          </div>
        )}
      )}
    </div>
  );
};

export default FoodPhotoAnalyzer;

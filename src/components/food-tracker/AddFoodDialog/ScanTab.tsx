
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Plus } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useCreditSystem } from "@/hooks/useCreditSystem";
import { useFoodPhotoIntegration } from "@/hooks/useFoodPhotoIntegration";
import FoodPhotoAnalysisCard from "@/components/food-photo-analysis/FoodPhotoAnalysisCard";
import QuantitySelector from "./components/QuantitySelector";
import { toast } from "sonner";

interface ScanTabProps {
  onFoodAdded: () => void;
  onClose: () => void;
}

const ScanTab = ({ onFoodAdded, onClose }: ScanTabProps) => {
  const { t } = useI18n();
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [quantity, setQuantity] = useState(100);
  const [mealType, setMealType] = useState("snack");
  const [notes, setNotes] = useState("");
  
  const { userCredits } = useCreditSystem();
  const { 
    logAnalyzedFood, 
    isLoggingFood 
  } = useFoodPhotoIntegration();

  const handleSelectFood = (food: any) => {
    setSelectedFood(food);
  };

  const handleAddFood = () => {
    if (!selectedFood) return;

    try {
      logAnalyzedFood(
        selectedFood,
        quantity,
        mealType,
        notes || `AI detected: ${selectedFood.quantity || 'estimated portion'}`
      );
      
      onFoodAdded();
      onClose();
    } catch (error) {
      console.error('Error logging scanned food:', error);
      toast.error(t('Failed to log food'));
    }
  };

  const canScan = userCredits === -1 || userCredits > 0;

  return (
    <div className="space-y-6">
      {/* Credits Display */}
      <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            {t('AI Credits')}
          </span>
        </div>
        <Badge variant={canScan ? "default" : "destructive"}>
          {userCredits === -1 ? t('Unlimited') : userCredits}
        </Badge>
      </div>

      {/* Photo Analysis */}
      <FoodPhotoAnalysisCard 
        onAnalyze={(imageUrl) => {
          console.log('Analyzing image:', imageUrl);
          // Mock food selection for now
          setSelectedFood({
            name: "Detected Food Item",
            calories: 250,
            protein: 12,
            carbs: 30,
            fat: 8,
            quantity: "1 serving"
          });
        }}
      />

      {/* Selected Food Details */}
      {selectedFood && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium text-gray-900">{t('Add to Log')}</h3>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800">{selectedFood.name}</h4>
            <p className="text-sm text-green-600">{selectedFood.quantity}</p>
            
            <div className="grid grid-cols-4 gap-2 mt-3 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round((selectedFood.calories || 0) * (quantity / 100))}
                </div>
                <div className="text-green-600">cal</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round((selectedFood.protein || 0) * (quantity / 100))}g
                </div>
                <div className="text-green-600">protein</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round((selectedFood.carbs || 0) * (quantity / 100))}g
                </div>
                <div className="text-green-600">carbs</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round((selectedFood.fat || 0) * (quantity / 100))}g
                </div>
                <div className="text-green-600">fat</div>
              </div>
            </div>
          </div>

          <QuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
            mealType={mealType}
            onMealTypeChange={setMealType}
            notes={notes}
            onNotesChange={setNotes}
          />

          <Button
            onClick={handleAddFood}
            disabled={isLoggingFood}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isLoggingFood ? t('Adding...') : t('Add to Log')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScanTab;

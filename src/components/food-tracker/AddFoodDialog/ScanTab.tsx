
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Zap, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAIFoodAnalysis } from "@/hooks/useAIFoodAnalysis";
import { useFoodDatabase } from "@/hooks/useFoodDatabase";
import { useCreditSystem } from "@/hooks/useCreditSystem";
import QuantitySelector from "./components/QuantitySelector";
import { toast } from "sonner";

interface ScanTabProps {
  onFoodAdded: () => void;
  onClose: () => void;
}

const ScanTab = ({ onFoodAdded, onClose }: ScanTabProps) => {
  const { t, isRTL } = useLanguage();
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [quantity, setQuantity] = useState(100);
  const [mealType, setMealType] = useState("snack");
  const [notes, setNotes] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { analyzeFood, isAnalyzing, analysisResult } = useAIFoodAnalysis();
  const { logConsumption, isLoggingConsumption } = useFoodDatabase();
  const { userCredits } = useCreditSystem();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      analyzeFood(file);
    }
  };

  const handleSelectFood = (food: any) => {
    setSelectedFood(food);
  };

  const handleAddFood = async () => {
    if (!selectedFood) return;

    const multiplier = quantity / 100;
    const calories = (selectedFood.calories || 0) * multiplier;
    const protein = (selectedFood.protein || 0) * multiplier;
    const carbs = (selectedFood.carbs || 0) * multiplier;
    const fat = (selectedFood.fat || 0) * multiplier;

    try {
      logConsumption({
        foodItemId: `scan-${Date.now()}`, // Temporary ID for scanned foods
        quantity,
        mealType,
        notes,
        calories,
        protein,
        carbs,
        fat,
        source: 'ai_analysis',
        mealImage: uploadedImage || undefined,
        mealData: selectedFood
      });
      
      onFoodAdded();
      onClose();
    } catch (error) {
      console.error('Error logging scanned food:', error);
      toast.error('Failed to log food');
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

      {/* Upload Section */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">{t('Scan Food Image')}</h3>
        
        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={!canScan || isAnalyzing}
            className="h-16 border-dashed border-2 hover:border-green-600 hover:bg-green-50"
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6" />
              <span className="text-sm">
                {isAnalyzing ? t('Analyzing...') : t('Upload Image')}
              </span>
            </div>
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {!canScan && (
          <p className="text-sm text-red-600 text-center">
            {t('No AI credits remaining. Upgrade to Pro for unlimited scans.')}
          </p>
        )}
      </div>

      {/* Uploaded Image Preview */}
      {uploadedImage && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">{t('Uploaded Image')}</h4>
          <div className="relative">
            <img
              src={URL.createObjectURL(uploadedImage)}
              alt="Uploaded food"
              className="w-full h-48 object-cover rounded-lg"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="text-white text-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm">{t('Analyzing image...')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && analysisResult.foodItems && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">{t('Detected Food Items')}</h3>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {analysisResult.foodItems.map((food: any, index: number) => (
              <Card 
                key={index} 
                className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                  selectedFood === food ? 'ring-2 ring-green-600 bg-green-50' : ''
                }`}
                onClick={() => handleSelectFood(food)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{food.name}</h4>
                    <p className="text-sm text-gray-500">{food.quantity}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {food.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {t('AI Detected')}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>{Math.round(food.calories || 0)} cal</div>
                    <div className="text-xs">per 100g</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {analysisResult.suggestions && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-1">{t('AI Suggestions')}</h4>
              <p className="text-sm text-yellow-700">{analysisResult.suggestions}</p>
            </div>
          )}
        </div>
      )}

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
            disabled={isLoggingConsumption}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isLoggingConsumption ? t('Adding...') : t('Add to Log')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScanTab;

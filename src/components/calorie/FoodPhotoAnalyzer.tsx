
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Loader2, Utensils, AlertCircle } from "lucide-react";
import { useAIFoodAnalysis } from "@/hooks/useAIFoodAnalysis";
import { AIFoodAnalysisResult, FoodAnalysisItem } from "@/types/aiAnalysis";

interface FoodPhotoAnalyzerProps {
  onSelectFood?: (food: any) => void;
}

const FoodPhotoAnalyzer = ({ onSelectFood }: FoodPhotoAnalyzerProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { analyzeFood, isAnalyzing, analysisResult, error } = useAIFoodAnalysis();

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageSelect(file);
    }
  };

  const handleAnalyze = () => {
    if (selectedImage) {
      analyzeFood(selectedImage);
    }
  };

  const handleSelectFood = (food: FoodAnalysisItem) => {
    if (onSelectFood) {
      // Convert to standardized food item format
      const standardizedFood = {
        id: `ai-${Date.now()}`, // Temporary ID for UI
        name: food.name,
        category: food.category || 'general',
        calories_per_100g: food.calories || 0,
        protein_per_100g: food.protein || 0,
        carbs_per_100g: food.carbs || 0,
        fat_per_100g: food.fat || 0,
        fiber_per_100g: food.fiber || 0,
        sugar_per_100g: food.sugar || 0,
        serving_size_g: 100,
        serving_description: food.quantity || '100g',
        confidence_score: analysisResult?.overallConfidence || 0.7,
        verified: false,
        source: 'ai_scan'
      };
      onSelectFood(standardizedFood);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm border border-gray-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">AI Food Scanner</h3>
            <p className="text-xs text-gray-600">Analyze food photos with AI</p>
          </div>
        </div>

        {/* Upload Area */}
        <div className="space-y-4">
          {!imagePreview ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">Click to upload a food photo</p>
              <p className="text-xs text-gray-500">Supports JPG, PNG files</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Selected food" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setImagePreview(null);
                    setSelectedImage(null);
                  }}
                  className="absolute top-2 right-2 bg-white/90"
                >
                  Change Photo
                </Button>
              </div>
              
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Analyze Food
                  </>
                )}
              </Button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-700">
                {error.message || 'Failed to analyze food image. Please try again.'}
              </p>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-800">Analysis Results</h4>
              <Badge variant="outline" className="text-xs">
                {Math.round((analysisResult.overallConfidence || 0.8) * 100)}% confidence
              </Badge>
            </div>

            {analysisResult.foodItems && analysisResult.foodItems.length > 0 ? (
              <div className="space-y-2">
                {analysisResult.foodItems.map((food: FoodAnalysisItem, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-sm font-medium text-gray-900">{food.name}</h5>
                        <Badge variant="outline" className="text-xs capitalize">
                          {food.category || 'general'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                        <span>{food.calories || 0} cal/100g</span>
                        <span>{food.protein || 0}g protein</span>
                        <span>{food.carbs || 0}g carbs</span>
                        <span>{food.fat || 0}g fat</span>
                      </div>
                      {food.quantity && (
                        <p className="text-xs text-gray-500 mt-1">Estimated: {food.quantity}</p>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleSelectFood(food)}
                      className="ml-3 bg-purple-600 hover:bg-purple-700 text-xs px-3 py-1"
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Utensils className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No food items detected</p>
                <p className="text-xs text-gray-500">Try a clearer photo with visible food</p>
              </div>
            )}

            {analysisResult.suggestions && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>AI Suggestion:</strong> {analysisResult.suggestions}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default FoodPhotoAnalyzer;

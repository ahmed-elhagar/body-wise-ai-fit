
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Loader2, Eye } from "lucide-react";
import { useAIFoodAnalysis } from "@/hooks/useAIFoodAnalysis";

const MealPhotoUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { analyzeFood, isAnalyzing, analysisResult } = useAIFoodAnalysis();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      analyzeFood(selectedFile);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
          <Camera className="w-5 h-5 mr-2" />
          Analyze Your Meal
        </h3>
        <p className="text-gray-600 mb-6">
          Upload a photo of your meal and get instant nutrition analysis with AI-powered food recognition
        </p>

        {!previewUrl ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-fitness-primary transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="meal-photo"
            />
            <label htmlFor="meal-photo" className="cursor-pointer">
              <Button variant="outline" className="mb-2">
                Choose Photo
              </Button>
            </label>
            <p className="text-sm text-gray-500">
              PNG, JPG up to 10MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Meal preview"
                className="max-w-full h-64 object-cover rounded-lg mx-auto"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={resetUpload}
                className="absolute top-2 right-2"
              >
                ✕
              </Button>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="bg-fitness-gradient hover:opacity-90 w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Analyze Nutrition
                </>
              )}
            </Button>
          </div>
        )}

        {analysisResult && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 text-left">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-green-800">Analysis Results</h4>
              {analysisResult.overallConfidence && (
                <Badge 
                  variant={analysisResult.overallConfidence > 0.7 ? "default" : "secondary"}
                  className="text-xs"
                >
                  {Math.round(analysisResult.overallConfidence * 100)}% confidence
                </Badge>
              )}
            </div>

            {/* Analyzed Image Display */}
            {analysisResult.imageData && (
              <div className="mb-4">
                <img
                  src={analysisResult.imageData}
                  alt="Analyzed meal"
                  className="w-full h-32 object-cover rounded border"
                />
              </div>
            )}

            {/* Meal Information */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
              {analysisResult.mealType && (
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="ml-1 capitalize">{analysisResult.mealType}</span>
                </div>
              )}
              {analysisResult.cuisineType && (
                <div>
                  <span className="font-medium text-gray-700">Cuisine:</span>
                  <span className="ml-1 capitalize">{analysisResult.cuisineType}</span>
                </div>
              )}
            </div>

            {/* Total Nutrition */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Calories</p>
                <Badge variant="outline" className="text-lg font-semibold">
                  {analysisResult.totalNutrition?.calories || 0}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Protein</p>
                <Badge variant="outline" className="text-lg font-semibold text-green-600">
                  {analysisResult.totalNutrition?.protein || 0}g
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Carbs</p>
                <Badge variant="outline" className="text-lg font-semibold text-blue-600">
                  {analysisResult.totalNutrition?.carbs || 0}g
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Fat</p>
                <Badge variant="outline" className="text-lg font-semibold text-orange-600">
                  {analysisResult.totalNutrition?.fat || 0}g
                </Badge>
              </div>
            </div>

            {/* Individual Food Items */}
            {analysisResult.foodItems && analysisResult.foodItems.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Detected Foods:</p>
                <div className="space-y-2">
                  {analysisResult.foodItems.map((food: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                      <div>
                        <span className="font-medium">{food.name}</span>
                        <span className="text-sm text-gray-600 ml-2">({food.quantity})</span>
                      </div>
                      <div className="text-sm text-gray-700">
                        {food.calories}cal • {food.protein}g protein
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysisResult.recommendations && (
              <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">Nutritionist Recommendations:</p>
                <p className="text-sm text-blue-700">{analysisResult.recommendations}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MealPhotoUpload;

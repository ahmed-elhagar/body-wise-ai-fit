
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Loader2, Eye, Zap, CreditCard } from "lucide-react";
import { useEnhancedFoodAnalysis } from "@/hooks/useEnhancedFoodAnalysis";
import { useProfile } from "@/hooks/useProfile";

const FoodPhotoAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { analyzeFood, isAnalyzing, analysisResult } = useEnhancedFoodAnalysis();
  const { profile } = useProfile();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

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

  const remainingCredits = profile?.ai_generations_remaining || 0;

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-lg">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">AI Food Recognition</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Upload a photo and get instant AI-powered nutrition analysis
          </p>
          
          {/* Credits indicator */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <Badge 
              variant={remainingCredits > 2 ? "default" : remainingCredits > 0 ? "secondary" : "destructive"}
              className="text-xs"
            >
              {remainingCredits} AI credits remaining
            </Badge>
          </div>
        </div>

        {!previewUrl ? (
          <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 sm:p-8 hover:border-blue-400 transition-colors bg-blue-50/50">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800">Upload Food Image</h4>
                <p className="text-sm text-gray-600">
                  JPG, PNG up to 10MB • Get instant calorie and nutrition data
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="food-photo"
                  disabled={remainingCredits <= 0}
                />
                <label htmlFor="food-photo">
                  <Button 
                    asChild 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                    disabled={remainingCredits <= 0}
                  >
                    <span className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Photo
                    </span>
                  </Button>
                </label>
                
                <Button 
                  variant="outline" 
                  className="border-blue-200 hover:bg-blue-50"
                  disabled={remainingCredits <= 0}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </div>

              {remainingCredits <= 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                  <p className="text-sm text-red-700 font-medium">
                    No AI credits remaining. Upgrade your plan or wait for credits to reset.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image preview */}
            <div className="relative">
              <img
                src={previewUrl}
                alt="Food preview"
                className="w-full h-48 sm:h-64 object-cover rounded-xl border border-gray-200"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={resetUpload}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-lg"
              >
                ✕
              </Button>
            </div>

            {/* Analysis button */}
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || remainingCredits <= 0}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Analyze Nutrition (1 credit)
                </>
              )}
            </Button>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-green-800 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Analysis Results
              </h4>
              {analysisResult.overallConfidence && (
                <Badge 
                  variant={analysisResult.overallConfidence > 0.7 ? "default" : "secondary"}
                  className="bg-green-100 text-green-700 border-green-300"
                >
                  {Math.round(analysisResult.overallConfidence * 100)}% confidence
                </Badge>
              )}
            </div>

            {/* Total Nutrition - Mobile friendly grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                <p className="text-xs text-gray-600 mb-1">Calories</p>
                <p className="text-lg font-bold text-orange-600">
                  {analysisResult.totalNutrition?.calories || 0}
                </p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                <p className="text-xs text-gray-600 mb-1">Protein</p>
                <p className="text-lg font-bold text-green-600">
                  {analysisResult.totalNutrition?.protein || 0}g
                </p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                <p className="text-xs text-gray-600 mb-1">Carbs</p>
                <p className="text-lg font-bold text-blue-600">
                  {analysisResult.totalNutrition?.carbs || 0}g
                </p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                <p className="text-xs text-gray-600 mb-1">Fat</p>
                <p className="text-lg font-bold text-purple-600">
                  {analysisResult.totalNutrition?.fat || 0}g
                </p>
              </div>
            </div>

            {/* Meal information */}
            {(analysisResult.mealType || analysisResult.cuisineType) && (
              <div className="flex flex-wrap gap-2">
                {analysisResult.mealType && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                    {analysisResult.mealType}
                  </Badge>
                )}
                {analysisResult.cuisineType && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                    {analysisResult.cuisineType} cuisine
                  </Badge>
                )}
              </div>
            )}

            {/* Food Items List */}
            {analysisResult.foodItems && analysisResult.foodItems.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-green-800">Detected Foods:</p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {analysisResult.foodItems.map((food: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-200 text-sm">
                      <div>
                        <span className="font-medium text-gray-800">{food.name}</span>
                        {food.quantity && (
                          <span className="text-gray-600 ml-2">({food.quantity})</span>
                        )}
                      </div>
                      <div className="text-gray-700 text-xs">
                        {food.calories}cal
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            {analysisResult.recommendations && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800 font-medium mb-1">💡 AI Recommendations:</p>
                <p className="text-sm text-blue-700">{analysisResult.recommendations}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default FoodPhotoAnalyzer;

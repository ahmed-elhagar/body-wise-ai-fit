
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Loader2 } from "lucide-react";
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
          Upload a photo of your meal and get instant nutrition analysis
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
                'Analyze Nutrition'
              )}
            </Button>
          </div>
        )}

        {analysisResult && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3">Analysis Results</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Calories</p>
                <Badge variant="outline" className="text-lg font-semibold">
                  {analysisResult.calories}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Protein</p>
                <Badge variant="outline" className="text-lg font-semibold text-green-600">
                  {analysisResult.protein}g
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Carbs</p>
                <Badge variant="outline" className="text-lg font-semibold text-blue-600">
                  {analysisResult.carbs}g
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Fat</p>
                <Badge variant="outline" className="text-lg font-semibold text-orange-600">
                  {analysisResult.fat}g
                </Badge>
              </div>
            </div>
            {analysisResult.foods && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Detected Foods:</p>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.foods.map((food, index) => (
                    <Badge key={index} variant="secondary">
                      {food}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MealPhotoUpload;

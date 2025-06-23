
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, Loader2, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAIFoodAnalysis } from '@/features/ai/hooks/useAIFoodAnalysis';
import { useFoodConsumption } from '../hooks/useFoodConsumption';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface PhotoScanTabProps {
  onFoodAdded: () => void;
  onClose: () => void;
}

const PhotoScanTab: React.FC<PhotoScanTabProps> = ({ onFoodAdded, onClose }) => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { analyzeFood, isAnalyzing, error } = useAIFoodAnalysis();
  const { addConsumption, isAddingConsumption } = useFoodConsumption();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('Image size should be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null);
        setIsAnalyzed(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    try {
      const result = await analyzeFood(selectedImage);
      setAnalysisResult(result);
      setIsAnalyzed(true);
      toast.success('Food analyzed successfully!');
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to analyze image. Please try again.');
    }
  };

  const handleAddToLog = async () => {
    if (!analysisResult) return;

    try {
      const quantity = 100; // Default serving size
      const multiplier = quantity / 100;

      const foodConsumptionData = { 
        food_item_id: crypto.randomUUID(), 
        quantity_g: quantity,
        calories_consumed: (analysisResult.calories || 0) * multiplier,
        protein_consumed: (analysisResult.protein || 0) * multiplier,
        carbs_consumed: (analysisResult.carbs || 0) * multiplier,
        fat_consumed: (analysisResult.fat || 0) * multiplier,
        meal_type: 'snack' as const,
        consumed_at: new Date().toISOString(),
        notes: `AI analyzed: ${analysisResult.food_name || 'Unknown food'}`,
        source: 'ai_analysis' as const,
        meal_image_url: selectedImage
      };

      await addConsumption(foodConsumptionData);
      toast.success('Food added to log successfully!');
      onFoodAdded();
    } catch (error) {
      console.error('Error adding food:', error);
      toast.error('Failed to add food. Please try again.');
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setIsAnalyzed(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Scan Food with AI</h3>
        <p className="text-gray-600">Take a photo or upload an image to analyze food nutrition</p>
      </div>

      {!selectedImage ? (
        <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Camera className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-4">Upload a food image</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-4">
              Supports JPG, PNG, WebP (max 10MB)
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected food"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearImage}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {!isAnalyzed ? (
            <div className="flex gap-3">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClearImage}>
                Clear
              </Button>
            </div>
          ) : analysisResult ? (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800 text-lg mb-2">
                      {analysisResult.food_name || 'Detected Food'}
                    </h4>
                    <p className="text-sm text-green-700 mb-4">
                      Confidence: {Math.round((analysisResult.confidence || 0) * 100)}%
                    </p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-800">
                          {Math.round(analysisResult.calories || 0)}
                        </div>
                        <div className="text-sm text-green-600">Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-800">
                          {Math.round(analysisResult.protein || 0)}g
                        </div>
                        <div className="text-sm text-green-600">Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-800">
                          {Math.round(analysisResult.carbs || 0)}g
                        </div>
                        <div className="text-sm text-green-600">Carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-800">
                          {Math.round(analysisResult.fat || 0)}g
                        </div>
                        <div className="text-sm text-green-600">Fat</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleAddToLog}
                        disabled={isAddingConsumption}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isAddingConsumption ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          'Add to Log'
                        )}
                      </Button>
                      <Button variant="outline" onClick={handleClearImage}>
                        Scan Another
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-700 text-sm font-medium">
                    Analysis failed. Please try again.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default PhotoScanTab;

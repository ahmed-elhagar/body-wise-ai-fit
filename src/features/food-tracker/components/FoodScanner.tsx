
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useFoodPhotoIntegration } from "@/hooks/useFoodPhotoIntegration";
import { useFoodDatabase } from "@/hooks/useFoodDatabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface FoodScannerProps {
  onFoodAdded: () => void;
  onClose: () => void;
}

const FoodScanner = ({ onFoodAdded, onClose }: FoodScannerProps) => {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'analyzing' | 'results' | 'adding'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    analyzePhoto,
    analysisResult, 
    isAnalyzing 
  } = useFoodPhotoIntegration();
  
  const { logConsumption, isLoggingConsumption } = useFoodDatabase();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setStep('upload');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setStep('analyzing');
    try {
      await analyzePhoto(selectedFile);
      setStep('results');
    } catch (error) {
      console.error('Analysis failed:', error);
      setStep('upload');
      toast.error('Failed to analyze food photo. Please try again.');
    }
  };

  const handleAddFood = async (foodItem: any, quantity: number = 100) => {
    if (!foodItem) return;
    
    setStep('adding');
    try {
      await logConsumption({
        foodItemId: `ai-${Date.now()}`,
        quantity: quantity,
        mealType: 'snack',
        notes: `AI analyzed: ${foodItem.name}`,
        calories: foodItem.calories || 0,
        protein: foodItem.protein || 0,
        carbs: foodItem.carbs || 0,
        fat: foodItem.fat || 0,
        source: 'ai_analysis',
        mealPlanData: foodItem
      });
      
      toast.success(`${foodItem.name} added to food log!`);
      onFoodAdded();
      onClose();
    } catch (error) {
      console.error('Failed to add food:', error);
      toast.error('Failed to add food to log');
      setStep('results');
    }
  };

  const resetScanner = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setStep('upload');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  if (step === 'upload') {
    return (
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            {t('Scan Food')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!previewUrl ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">{t('Take a photo or upload an image of your food')}</p>
              <p className="text-sm text-gray-500 mb-4">{t('AI will analyze and identify the food items')}</p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-fitness-gradient hover:opacity-90"
              >
                <Upload className="w-4 h-4 mr-2" />
                {t('Upload Photo')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Food preview"
                  className="max-w-full h-64 object-cover rounded-lg mx-auto"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetScanner}
                  className="absolute top-2 right-2"
                >
                  ✕
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-fitness-gradient hover:opacity-90 flex-1"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('Analyzing...')}
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      {t('Analyze Food')}
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {t('Choose Different Photo')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (step === 'analyzing') {
    return (
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t('Analyzing Your Food...')}
              </h3>
              <p className="text-gray-600">
                {t('Our AI is identifying the food items and calculating nutrition information')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'results' && analysisResult) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            {t('Analysis Results')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysisResult.analysis?.foodItems?.map((foodItem: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-lg text-gray-800">{foodItem.name}</h4>
                  <p className="text-sm text-gray-600">{foodItem.quantity}</p>
                  <p className="text-xs text-gray-500">
                    Confidence: {Math.round((analysisResult.analysis.overallConfidence || 0.8) * 100)}%
                  </p>
                </div>
                
                <Button
                  onClick={() => handleAddFood(foodItem)}
                  disabled={isLoggingConsumption}
                  className="bg-fitness-gradient hover:opacity-90"
                  size="sm"
                >
                  {t('Add to Log')}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-2 rounded text-center">
                  <p className="text-xs text-gray-500">{t('Calories')}</p>
                  <p className="font-bold text-red-600">{foodItem.calories || 0}</p>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <p className="text-xs text-gray-500">{t('Protein')}</p>
                  <p className="font-bold text-blue-600">{foodItem.protein || 0}g</p>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <p className="text-xs text-gray-500">{t('Carbs')}</p>
                  <p className="font-bold text-yellow-600">{foodItem.carbs || 0}g</p>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <p className="text-xs text-gray-500">{t('Fat')}</p>
                  <p className="font-bold text-green-600">{foodItem.fat || 0}g</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={resetScanner}
              className="flex-1"
            >
              {t('Scan Another')}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t('Close')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'adding') {
    return (
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t('Adding to Food Log...')}
              </h3>
              <p className="text-gray-600">
                {t('Saving the analyzed food to your nutrition tracking')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardContent className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {t('Analysis Failed')}
        </h3>
        <p className="text-gray-600 mb-4">
          {t('Unable to analyze the food image. Please try again.')}
        </p>
        <Button onClick={resetScanner} className="bg-fitness-gradient hover:opacity-90">
          {t('Try Again')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FoodScanner;

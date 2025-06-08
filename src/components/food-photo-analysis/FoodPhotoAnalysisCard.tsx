
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import FoodAnalysisResults from './FoodAnalysisResults';

export const FoodPhotoAnalysisCard = () => {
  const { t, isRTL } = useI18n();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setAnalysisResults({
        foods: [
          { name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, confidence: 0.92 },
          { name: 'White Rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, confidence: 0.88 },
          { name: 'Steamed Broccoli', calories: 25, protein: 3, carbs: 5, fat: 0.3, confidence: 0.85 }
        ],
        totalCalories: 320,
        totalProtein: 36.7,
        totalCarbs: 33,
        totalFat: 4.2
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  if (analysisResults) {
    return <FoodAnalysisResults results={analysisResults} />;
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Camera className="w-5 h-5 text-blue-500" />
          {t('foodAnalysis:analyzeFood') || 'Analyze Food Photo'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {t('foodAnalysis:analyzing') || 'Analyzing Your Food...'}
            </h3>
            <p className="text-gray-600">
              {t('foodAnalysis:analyzingDescription') || 'Our AI is identifying foods and calculating nutrition information'}
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {t('foodAnalysis:uploadPhoto') || 'Upload Food Photo'}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('foodAnalysis:uploadDescription') || 'Take a photo or upload an image of your meal to get instant nutrition analysis'}
            </p>
            
            <div className={`flex gap-4 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <label className={`cursor-pointer flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Camera className="w-4 h-4" />
                  {t('foodAnalysis:takePhoto') || 'Take Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </Button>
              
              <Button variant="outline" asChild>
                <label className={`cursor-pointer flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Upload className="w-4 h-4" />
                  {t('foodAnalysis:uploadImage') || 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodPhotoAnalysisCard;

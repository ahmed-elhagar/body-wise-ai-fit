
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Loader2, Utensils, AlertCircle, Zap } from "lucide-react";
import { useEnhancedFoodAnalysis } from '@/hooks/useEnhancedFoodAnalysis';
import { useFoodPhotoIntegration } from '@/hooks/useFoodPhotoIntegration';
import { useCentralizedCredits } from "@/hooks/useCentralizedCredits";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface FoodPhotoAnalysisCardProps {
  onFoodSelected?: (food: any) => void;
  className?: string;
}

const FoodPhotoAnalysisCard = ({ onFoodSelected, className = "" }: FoodPhotoAnalysisCardProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mealType, setMealType] = useState('snack');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const { analyzePhotoFood, isAnalyzing, analysisResult, error, convertToFoodItem } = useEnhancedFoodAnalysis();
  const { processAndLogFood, isProcessing } = useFoodPhotoIntegration();
  const { remaining: userCredits } = useCentralizedCredits();
  const { t } = useLanguage();

  const handleImageSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(t('Please select a valid image file'));
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error(t('Image size must be less than 10MB'));
      return;
    }

    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleAnalyze = async () => {
    if (selectedFile && canAnalyze) {
      try {
        await analyzePhotoFood(selectedFile);
      } catch (error) {
        console.error('Analysis failed:', error);
      }
    } else if (!canAnalyze) {
      toast.error(t('No AI credits remaining. Please upgrade to continue.'));
    }
  };

  const handleSelectFood = (food: any) => {
    console.log('🎯 Food selected:', food);
    
    if (onFoodSelected) {
      // Convert and pass to parent component
      const standardizedFood = convertToFoodItem(food);
      onFoodSelected(standardizedFood);
    } else {
      // Navigate to food tracker with the analyzed food
      const standardizedFood = convertToFoodItem(food);
      console.log('🔄 Navigating to food tracker with food:', standardizedFood);
      
      toast.success(t('Food analyzed! Adding to tracker...'));
      
      navigate('/food-tracker', { 
        state: { 
          analyzedFood: standardizedFood,
          openAddDialog: true 
        } 
      });
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const canAnalyze = userCredits === -1 || userCredits > 0;

  return (
    <Card className={`p-6 bg-white shadow-sm border border-gray-200 ${className}`}>
      <div className="space-y-4">
        {/* Header with Credits */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">{t('AI Food Scanner')}</h3>
              <p className="text-xs text-gray-600">{t('Analyze food photos with AI')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <Badge variant={canAnalyze ? "default" : "destructive"} className="text-xs">
              {userCredits === -1 ? t('Unlimited') : userCredits}
            </Badge>
          </div>
        </div>

        {/* Upload Area */}
        <div className="space-y-4">
          {!imagePreview ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">{t('Click to upload a food photo')}</p>
              <p className="text-xs text-gray-500">{t('Supports JPG, PNG files up to 10MB')}</p>
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
                  onClick={resetAnalysis}
                  className="absolute top-2 right-2 bg-white/90"
                >
                  {t('Change')}
                </Button>
              </div>
              
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !canAnalyze}
                className="w-full bg-purple-600 hover:bg-purple-700"
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

              {!canAnalyze && (
                <p className="text-xs text-red-600 text-center">
                  {t('No AI credits remaining. Upgrade to Pro for unlimited scans.')}
                </p>
              )}
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
                {error || t('Failed to analyze food image. Please try again.')}
              </p>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult?.results && analysisResult.results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-800">{t('Analysis Results')}</h4>
              <Badge variant="outline" className="text-xs">
                {Math.round((analysisResult.results[0]?.confidence || 0.8) * 100)}% {t('confidence')}
              </Badge>
            </div>

            <div className="space-y-2">
              {analysisResult.results.map((food: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200 hover:shadow-sm transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="text-sm font-medium text-gray-900">{food.food_name}</h5>
                      <Badge variant="outline" className="text-xs capitalize">
                        general
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                      <span>{food.nutrition?.calories || 0} cal</span>
                      <span>{food.nutrition?.protein || 0}g protein</span>
                      <span>{food.nutrition?.carbs || 0}g carbs</span>
                      <span>{food.nutrition?.fat || 0}g fat</span>
                    </div>
                    {food.portion_size && (
                      <p className="text-xs text-purple-600 mt-1">{t('Estimated')}: {food.portion_size}</p>
                    )}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleSelectFood(food)}
                    className="ml-3 bg-purple-600 hover:bg-purple-700 text-xs px-3 py-1"
                  >
                    {t('Select')}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results State */}
        {analysisResult?.success === false && (
          <div className="text-center py-4">
            <Utensils className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-600">{t('No food items detected')}</p>
            <p className="text-xs text-gray-500">{t('Try a clearer photo with visible food')}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FoodPhotoAnalysisCard;

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload, Loader2, Eye } from "lucide-react";
import { useFoodPhotoIntegration } from "@/hooks/useFoodPhotoIntegration";
import FoodAnalysisResults from "@/components/food-photo-analysis/FoodAnalysisResults";
import { useI18n } from "@/hooks/useI18n";

interface MealPhotoUploadProps {
  onPhotoUploaded: (photoUrl: string) => void;
}

const MealPhotoUpload = ({ onPhotoUploaded }: MealPhotoUploadProps) => {
  const { t } = useI18n();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const { 
    analyzePhoto,
    analysisResult, 
    isAnalyzing, 
    logAnalyzedFood 
  } = useFoodPhotoIntegration();

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
      analyzePhoto(selectedFile);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleAddToLog = async (food: any) => {
    logAnalyzedFood(food, 100, 'meal', `Added from meal photo analysis`);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
            <Camera className="w-5 h-5 mr-2" />
            {t('Analyze Your Meal')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('Upload a photo of your meal and get instant nutrition analysis with AI-powered food recognition')}
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
                  {t('Choose Photo')}
                </Button>
              </label>
              <p className="text-sm text-gray-500">
                {t('PNG, JPG up to 10MB')}
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
                    {t('Analyzing...')}
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    {t('Analyze Nutrition')}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <FoodAnalysisResults
          result={analysisResult}
          onAddToLog={handleAddToLog}
          className="w-full"
        />
      )}
    </div>
  );
};

export default MealPhotoUpload;

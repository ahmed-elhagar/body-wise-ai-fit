
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Camera, Upload, Loader2, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FoodPhotoAnalyzerProps {
  onSelectFood: (food: any) => void;
}

const FoodPhotoAnalyzer = ({ onSelectFood }: FoodPhotoAnalyzerProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { t } = useLanguage();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    
    // Mock analysis - in real app this would call AI service
    setTimeout(() => {
      const mockResult = {
        name: "Mixed Salad",
        description: "Fresh green salad with vegetables",
        calories: 150,
        protein: 8,
        carbs: 12,
        fat: 6
      };
      
      onSelectFood(mockResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
            <Camera className="w-5 h-5 mr-2" />
            {t('Analyze Your Food')}
          </h3>
          
          {!previewUrl ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-purple-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="food-photo"
              />
              <label htmlFor="food-photo" className="cursor-pointer">
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
                  alt="Food preview"
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
                className="bg-purple-600 hover:bg-purple-700 w-full"
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
    </div>
  );
};

export default FoodPhotoAnalyzer;

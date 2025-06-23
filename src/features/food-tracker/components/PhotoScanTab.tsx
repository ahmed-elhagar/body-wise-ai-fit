
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, Loader2, X } from 'lucide-react';
import { useAIFoodAnalysis } from '@/features/ai/hooks/useAIFoodAnalysis';
import ManualTab from './ManualTab';
import { toast } from 'sonner';

interface PhotoScanTabProps {
  onFoodAdded: () => void;
  onClose: () => void;
}

const PhotoScanTab: React.FC<PhotoScanTabProps> = ({ onFoodAdded, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { analyzeFood, isAnalyzing, error } = useAIFoodAnalysis();

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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    try {
      const result = await analyzeFood(selectedImage);
      setAnalysisResult(result);
      setShowManualEntry(true);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to analyze image. Please try again.');
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setShowManualEntry(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (showManualEntry && analysisResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Review AI Analysis</h3>
          <Button variant="outline" onClick={() => setShowManualEntry(false)}>
            Back to Photo
          </Button>
        </div>
        <ManualTab 
          onFoodAdded={onFoodAdded} 
          onClose={onClose}
          preSelectedFood={{
            name: analysisResult.food_name || 'Detected Food',
            calories: analysisResult.calories || 0,
            protein: analysisResult.protein || 0,
            carbs: analysisResult.carbs || 0,
            fat: analysisResult.fat || 0,
            quantity: analysisResult.serving_size || '1 serving'
          }}
        />
      </div>
    );
  }

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
            <div className="flex gap-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </div>
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
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
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

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-600 text-sm">
                  {error instanceof Error ? error.message : 'Analysis failed'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default PhotoScanTab;

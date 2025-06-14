
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2 } from "lucide-react";
import { toast } from 'sonner';

interface FoodPhotoAnalysisCardProps {
  onFoodSelected?: (food: any) => void;
  className?: string;
}

const FoodPhotoAnalysisCard = ({ onFoodSelected, className }: FoodPhotoAnalysisCardProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    
    try {
      // Create preview
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      
      // Simulate AI analysis
      setTimeout(() => {
        const mockAnalysis = {
          name: "Grilled Chicken Breast",
          calories: 231,
          protein: 43.5,
          carbs: 0,
          fat: 5,
          confidence: 0.92
        };
        
        if (onFoodSelected) {
          onFoodSelected(mockAnalysis);
        }
        
        toast.success('Food analyzed successfully!');
        setIsAnalyzing(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error analyzing food:', error);
      toast.error('Failed to analyze food photo');
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
            <Camera className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">AI Food Analysis</h3>
            <p className="text-gray-600 text-sm">
              Upload a photo of your food and get instant nutrition information
            </p>
          </div>

          {selectedImage && (
            <div className="relative">
              <img 
                src={selectedImage} 
                alt="Selected food" 
                className="max-w-full h-48 object-cover rounded-lg mx-auto"
              />
            </div>
          )}

          {isAnalyzing ? (
            <div className="space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
              <p className="text-sm text-blue-600">Analyzing food...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="food-photo-upload"
              />
              <label htmlFor="food-photo-upload">
                <Button asChild className="w-full">
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Food Photo
                  </span>
                </Button>
              </label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodPhotoAnalysisCard;

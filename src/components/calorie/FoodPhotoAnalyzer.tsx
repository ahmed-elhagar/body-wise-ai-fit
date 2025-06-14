
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2 } from "lucide-react";
import FoodAnalysisResults from "@/components/food-photo-analysis/FoodAnalysisResults";

const FoodPhotoAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        analyzeImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    
    // Simulate API call for now
    setTimeout(() => {
      const mockResult = {
        name: "Grilled Chicken Salad",
        description: "Mixed greens with grilled chicken breast, tomatoes, and light vinaigrette",
        calories: 320,
        protein: 35,
        carbs: 12,
        fat: 18,
        confidence: 0.85
      };
      
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleAddToLog = (food: any) => {
    console.log('Adding to food log:', food);
    // TODO: Implement actual food log addition
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Food Photo Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt="Selected food" 
                className="max-w-full h-64 object-cover mx-auto rounded-lg"
              />
            ) : (
              <div>
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Take a photo or upload an image of your food</p>
                <p className="text-sm text-gray-500">We'll analyze it and estimate nutritional information</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {isAnalyzing && (
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing your food...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {analysisResult && (
        <FoodAnalysisResults 
          result={analysisResult}
          onAddToLog={handleAddToLog}
        />
      )}
    </div>
  );
};

export default FoodPhotoAnalyzer;

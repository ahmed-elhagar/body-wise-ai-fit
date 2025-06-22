import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Loader2, Zap, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFoodPhotoIntegration } from "@/features/food-tracker/hooks/useFoodPhotoIntegration";
import { useCentralizedCredits } from "@/shared/hooks/useCentralizedCredits";
import FoodAnalysisResults from "./food-photo-analysis/FoodAnalysisResults";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const CalorieChecker = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { 
    analyzePhotoFood, 
    isAnalyzing, 
    analysisResult, 
    logAnalyzedFood,
    convertToFoodItem,
    error 
  } = useFoodPhotoIntegration();
  
  const { credits } = useCentralizedCredits();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    if (credits <= 0) {
      toast.error('No AI credits remaining. Please upgrade to Pro or wait for daily reset.');
      return;
    }

    try {
      await analyzePhotoFood(selectedFile);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const handleAddToLog = async (food: any) => {
    try {
      const convertedFood = convertToFoodItem(food);
      await logAnalyzedFood(convertedFood, 100, 'snack', 'Added from AI food scan');
      toast.success('Food added to your log!');
    } catch (error) {
      console.error('Failed to add food to log:', error);
      toast.error('Failed to add food to log');
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 to-brand-secondary-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/food-tracker')}
            className="text-brand-neutral-600 hover:text-brand-neutral-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Food Tracker
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-neutral-900 flex items-center gap-3">
              <Camera className="h-8 w-8 text-brand-primary-500" />
              AI Food Scanner
            </h1>
            <p className="text-brand-neutral-600 mt-2">
              Scan your food to get instant calorie and nutrition information powered by AI.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-brand-primary-100 text-brand-primary-700">
              <Zap className="w-3 h-3 mr-1" />
              {credits} Credits
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-brand-neutral-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand-neutral-900">
                <Upload className="w-5 h-5 text-brand-primary-500" />
                Upload Food Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Preview */}
              <div className="border-2 border-dashed border-brand-neutral-300 rounded-xl p-8 text-center bg-gradient-to-br from-brand-neutral-50 to-white">
                {selectedImage ? (
                  <div className="relative">
                    <img 
                      src={selectedImage} 
                      alt="Selected food" 
                      className="max-w-full h-64 object-cover mx-auto rounded-lg shadow-md"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetAnalysis}
                      className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm"
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Camera className="w-20 h-20 text-brand-neutral-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-brand-neutral-700 mb-2">
                      Take or Upload a Photo
                    </h3>
                    <p className="text-brand-neutral-500 mb-4">
                      Our AI will analyze your food and provide detailed nutrition information
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center text-xs text-brand-neutral-400">
                      <span className="bg-brand-neutral-100 px-2 py-1 rounded">JPG</span>
                      <span className="bg-brand-neutral-100 px-2 py-1 rounded">PNG</span>
                      <span className="bg-brand-neutral-100 px-2 py-1 rounded">WEBP</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-brand-primary-600 to-brand-secondary-600 hover:opacity-90 text-white"
                  size="lg"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Choose Photo
                </Button>

                {selectedImage && (
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || credits <= 0}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Analyze Food ({credits > 0 ? '1 credit' : 'No credits'})
                      </>
                    )}
                  </Button>
                )}

                {credits <= 0 && (
                  <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-orange-700 text-sm font-medium">
                      No AI credits remaining. Upgrade to Pro for unlimited scans!
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/pro')}
                      className="mt-2 border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      Upgrade Now
                    </Button>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {error && (
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {isAnalyzing && (
              <Card className="bg-white/80 backdrop-blur-sm border-brand-neutral-200 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="animate-pulse space-y-4">
                    <Loader2 className="w-12 h-12 text-brand-primary-500 mx-auto animate-spin" />
                    <h3 className="text-lg font-semibold text-brand-neutral-700">
                      AI is analyzing your food...
                    </h3>
                    <p className="text-brand-neutral-500">
                      This may take a few seconds. We're identifying ingredients and calculating nutrition.
                    </p>
                    <div className="w-full bg-brand-neutral-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 h-2 rounded-full animate-pulse w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {analysisResult && !isAnalyzing && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Analysis Complete!</span>
                </div>
                <FoodAnalysisResults 
                  result={analysisResult}
                  onAddToLog={handleAddToLog}
                  className="bg-white/80 backdrop-blur-sm border-brand-neutral-200 shadow-lg"
                />
              </div>
            )}

            {!analysisResult && !isAnalyzing && (
              <Card className="bg-white/80 backdrop-blur-sm border-brand-neutral-200 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-primary-100 to-brand-secondary-100 rounded-full flex items-center justify-center mx-auto">
                      <Zap className="w-8 h-8 text-brand-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-brand-neutral-700">
                      Ready to Analyze
                    </h3>
                    <p className="text-brand-neutral-500">
                      Upload a photo of your food and our AI will provide detailed nutrition analysis including calories, macros, and more.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-brand-neutral-600">
                      <div className="bg-brand-neutral-50 p-3 rounded-lg">
                        <strong>✓ Instant Analysis</strong>
                        <br />Get results in seconds
                      </div>
                      <div className="bg-brand-neutral-50 p-3 rounded-lg">
                        <strong>✓ Detailed Nutrition</strong>
                        <br />Calories, protein, carbs, fat
                      </div>
                      <div className="bg-brand-neutral-50 p-3 rounded-lg">
                        <strong>✓ Auto Food Log</strong>
                        <br />Add directly to tracker
                      </div>
                      <div className="bg-brand-neutral-50 p-3 rounded-lg">
                        <strong>✓ Cultural Foods</strong>
                        <br />Recognizes global cuisines
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieChecker;

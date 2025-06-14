
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Loader2, CheckCircle, AlertCircle, Sparkles, Zap, Image as ImageIcon, Star } from "lucide-react";
import { useFoodPhotoIntegration } from "@/hooks/useFoodPhotoIntegration";
import { useCentralizedCredits } from "@/hooks/useCentralizedCredits";
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
  const [selectedFoodIndex, setSelectedFoodIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    analyzePhoto,
    analysisResult, 
    isAnalyzing 
  } = useFoodPhotoIntegration();
  
  const { logConsumption, isLoggingConsumption } = useFoodDatabase();
  const { remaining: creditsRemaining, hasCredits } = useCentralizedCredits();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size too large. Please select an image under 10MB.');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file.');
        return;
      }
      
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setStep('upload');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    if (!hasCredits) {
      toast.error('No AI credits remaining. Please upgrade your plan.');
      return;
    }
    
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
    setSelectedFoodIndex(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  if (step === 'upload') {
    return (
      <div className="space-y-4">
        {/* Header */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">AI Food Scanner</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Get instant nutrition info from photos
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Zap className="w-3 h-3" />
                  <span>Credits</span>
                </div>
                <Badge variant={hasCredits ? "secondary" : "destructive"} className="text-xs">
                  {creditsRemaining === -1 ? 'Unlimited' : creditsRemaining}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Upload Section */}
        <Card>
          <CardContent className="p-6">
            {!previewUrl ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-green-300 transition-colors">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-2">
                    Upload Food Photo
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Take a clear photo for accurate nutrition analysis
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button 
                      onClick={handleCameraCapture}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={!hasCredits}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                    
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      disabled={!hasCredits}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                  
                  {!hasCredits && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                      No AI credits remaining. Please upgrade your plan.
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-center text-gray-500">
                  Supported: JPG, PNG, WebP • Max: 10MB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Food preview"
                    className="max-w-full h-48 object-cover rounded-lg mx-auto"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetScanner}
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                  >
                    ✕
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !hasCredits}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze with AI
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'analyzing') {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                Analyzing Your Food...
              </h3>
              <p className="text-sm text-gray-600">
                AI is identifying ingredients and calculating nutrition
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'results' && analysisResult) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Analysis Complete
              <Badge className="bg-green-50 text-green-700 text-xs">
                {Math.round((analysisResult.analysis?.overallConfidence || 0.8) * 100)}% Confident
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="space-y-3">
          {analysisResult.analysis?.foodItems?.map((foodItem: any, index: number) => (
            <Card 
              key={index} 
              className={`cursor-pointer transition-all ${
                selectedFoodIndex === index ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={() => setSelectedFoodIndex(selectedFoodIndex === index ? null : index)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{foodItem.name}</h4>
                      <Badge 
                        className={`text-xs ${getConfidenceColor(foodItem.confidence || 0.8)}`}
                      >
                        {getConfidenceText(foodItem.confidence || 0.8)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{foodItem.quantity}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Detected
                      </Badge>
                      {foodItem.confidence >= 0.8 && (
                        <Badge variant="outline" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          High Quality
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddFood(foodItem);
                    }}
                    disabled={isLoggingConsumption}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoggingConsumption ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Add to Log'
                    )}
                  </Button>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-red-50 p-2 rounded text-center">
                    <p className="text-xs text-red-600 font-medium">Calories</p>
                    <p className="text-lg font-bold text-red-700">{foodItem.calories || 0}</p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <p className="text-xs text-blue-600 font-medium">Protein</p>
                    <p className="text-lg font-bold text-blue-700">{foodItem.protein || 0}g</p>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded text-center">
                    <p className="text-xs text-yellow-600 font-medium">Carbs</p>
                    <p className="text-lg font-bold text-yellow-700">{foodItem.carbs || 0}g</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <p className="text-xs text-green-600 font-medium">Fat</p>
                    <p className="text-lg font-bold text-green-700">{foodItem.fat || 0}g</p>
                  </div>
                </div>

                {selectedFoodIndex === index && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {foodItem.fiber && (
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Fiber: </span>
                          <span className="font-medium">{foodItem.fiber}g</span>
                        </div>
                      )}
                      {foodItem.sugar && (
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Sugar: </span>
                          <span className="font-medium">{foodItem.sugar}g</span>
                        </div>
                      )}
                      {foodItem.sodium && (
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Sodium: </span>
                          <span className="font-medium">{foodItem.sodium}mg</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={resetScanner}
            className="flex-1"
          >
            Scan Another
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'adding') {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                Adding to Food Log...
              </h3>
              <p className="text-sm text-gray-600">
                Saving your analyzed food
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="font-medium text-gray-900 mb-2">
          Analysis Failed
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Unable to analyze the food image. Please try again.
        </p>
        <Button 
          onClick={resetScanner} 
          className="bg-green-600 hover:bg-green-700"
        >
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};

export default FoodScanner;

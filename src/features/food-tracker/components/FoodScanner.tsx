
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, Upload, Loader2, CheckCircle, AlertCircle, Sparkles, Zap, Image as ImageIcon, Star, Clock, Utensils } from "lucide-react";
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
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size too large. Please select an image under 10MB.');
        return;
      }
      
      // Validate file type
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
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  if (step === 'upload') {
    return (
      <div className="space-y-6">
        {/* Enhanced Header with Credits */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 border-0 shadow-xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
          
          <CardHeader className="relative pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                    {t('AI Food Scanner')}
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      Smart Analysis
                    </Badge>
                  </CardTitle>
                  <p className="text-white/80 text-lg">
                    {t('Get instant nutrition info from your food photos')}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span className="text-white/90 font-medium">{t('AI Credits')}</span>
                </div>
                <Badge 
                  variant={hasCredits ? "secondary" : "destructive"}
                  className={hasCredits ? "bg-white/20 text-white border-white/30 text-lg px-3 py-1" : ""}
                >
                  {creditsRemaining === -1 ? 'Unlimited' : creditsRemaining}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Upload Section */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8">
            {!previewUrl ? (
              <div className="space-y-8">
                <div className="border-2 border-dashed border-gray-300 rounded-3xl p-16 text-center hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:from-green-100 group-hover:to-emerald-100 transition-all duration-300">
                    <ImageIcon className="w-12 h-12 text-gray-400 group-hover:text-green-600 transition-colors duration-300" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {t('Upload Your Food Photo')}
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
                    {t('Take a clear photo of your meal and our advanced AI will identify ingredients, calculate nutrition values, and estimate portions with high accuracy')}
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <Button 
                      onClick={handleCameraCapture}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      disabled={!hasCredits}
                    >
                      <Camera className="w-6 h-6 mr-3" />
                      {t('Take Photo')}
                    </Button>
                    
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="px-8 py-4 rounded-2xl font-semibold text-lg border-2 hover:bg-gray-50 transition-all duration-300"
                      disabled={!hasCredits}
                    >
                      <Upload className="w-6 h-6 mr-3" />
                      {t('Choose from Gallery')}
                    </Button>
                  </div>
                  
                  {!hasCredits && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl max-w-md mx-auto">
                      <p className="text-red-700 font-medium">
                        {t('No AI credits remaining. Please upgrade your plan to continue.')}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <p className="text-gray-500">
                    {t('Supported formats: JPG, PNG, WebP • Max size: 10MB')}
                  </p>
                  <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>99% Accuracy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>~3 seconds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-purple-600" />
                      <span>1000+ foods</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative group">
                  <img
                    src={previewUrl}
                    alt="Food preview"
                    className="max-w-full h-96 object-cover rounded-3xl mx-auto shadow-2xl"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetScanner}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-xl"
                  >
                    ✕
                  </Button>
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-3xl transition-all duration-300" />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !hasCredits}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white flex-1 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        {t('Analyzing...')}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6 mr-3" />
                        {t('Analyze with AI')}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-4 rounded-2xl font-semibold border-2"
                  >
                    {t('Choose Different')}
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
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-16 text-center">
          <div className="space-y-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="w-12 h-12 animate-spin text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full animate-pulse"></div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-gray-800">
                {t('AI is Analyzing Your Food...')}
              </h3>
              <p className="text-gray-600 max-w-lg mx-auto text-lg leading-relaxed">
                {t('Our advanced AI is identifying ingredients, calculating nutrition values, and estimating portions with high precision')}
              </p>
            </div>
            
            <div className="flex justify-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'results' && analysisResult) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <CheckCircle className="w-8 h-8 text-green-600" />
              {t('Analysis Complete')}
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-lg px-3 py-1">
                {Math.round((analysisResult.analysis?.overallConfidence || 0.8) * 100)}% Confident
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="grid gap-4">
          {analysisResult.analysis?.foodItems?.map((foodItem: any, index: number) => (
            <Card 
              key={index} 
              className={`bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                selectedFoodIndex === index ? 'ring-2 ring-green-500 bg-green-50/50' : ''
              }`}
              onClick={() => setSelectedFoodIndex(selectedFoodIndex === index ? null : index)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-2xl font-bold text-gray-800">{foodItem.name}</h4>
                      <Badge 
                        className={`${getConfidenceColor(foodItem.confidence || 0.8)} border-0`}
                      >
                        {getConfidenceText(foodItem.confidence || 0.8)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-lg mb-3">{foodItem.quantity}</p>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-sm border-purple-200 text-purple-700 bg-purple-50">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Detected
                      </Badge>
                      {foodItem.confidence >= 0.8 && (
                        <Badge variant="outline" className="text-sm border-yellow-200 text-yellow-700 bg-yellow-50">
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
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {isLoggingConsumption ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      t('Add to Log')
                    )}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-2xl text-center border border-red-200">
                    <p className="text-sm text-red-600 font-semibold mb-2">{t('Calories')}</p>
                    <p className="text-3xl font-bold text-red-700">{foodItem.calories || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl text-center border border-blue-200">
                    <p className="text-sm text-blue-600 font-semibold mb-2">{t('Protein')}</p>
                    <p className="text-3xl font-bold text-blue-700">{foodItem.protein || 0}g</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-2xl text-center border border-yellow-200">
                    <p className="text-sm text-yellow-600 font-semibold mb-2">{t('Carbs')}</p>
                    <p className="text-3xl font-bold text-yellow-700">{foodItem.carbs || 0}g</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-2xl text-center border border-green-200">
                    <p className="text-sm text-green-600 font-semibold mb-2">{t('Fat')}</p>
                    <p className="text-3xl font-bold text-green-700">{foodItem.fat || 0}g</p>
                  </div>
                </div>

                {/* Additional Details when selected */}
                {selectedFoodIndex === index && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      {foodItem.fiber && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="text-gray-600">Fiber:</span>
                          <span className="font-semibold ml-1">{foodItem.fiber}g</span>
                        </div>
                      )}
                      {foodItem.sugar && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="text-gray-600">Sugar:</span>
                          <span className="font-semibold ml-1">{foodItem.sugar}g</span>
                        </div>
                      )}
                      {foodItem.sodium && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="text-gray-600">Sodium:</span>
                          <span className="font-semibold ml-1">{foodItem.sodium}mg</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={resetScanner}
            className="flex-1 py-4 rounded-2xl font-semibold text-lg border-2"
          >
            {t('Scan Another')}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-semibold text-lg border-2"
          >
            {t('Close')}
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'adding') {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-16 text-center">
          <div className="space-y-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-12 h-12 animate-spin text-white" />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-gray-800">
                {t('Adding to Food Log...')}
              </h3>
              <p className="text-gray-600 max-w-lg mx-auto text-lg">
                {t('Saving your analyzed food to your nutrition tracking')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-12 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {t('Analysis Failed')}
        </h3>
        <p className="text-gray-600 mb-6">
          {t('Unable to analyze the food image. Please try again with a clearer photo.')}
        </p>
        <Button 
          onClick={resetScanner} 
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-medium"
        >
          {t('Try Again')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FoodScanner;

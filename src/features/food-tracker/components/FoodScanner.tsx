
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Loader2, CheckCircle, AlertCircle, Sparkles, Zap, Image as ImageIcon } from "lucide-react";
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

  if (step === 'upload') {
    return (
      <div className="space-y-6">
        {/* Enhanced Header with Credits */}
        <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-0 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-emerald-600/5" />
          <CardHeader className="relative pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {t('AI Food Scanner')}
                    <Badge variant="secondary" className="bg-green-100 text-green-700 font-medium">
                      Smart Analysis
                    </Badge>
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    {t('Get instant nutrition info from your food photos')}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">{t('Credits')}</span>
                </div>
                <Badge 
                  variant={hasCredits ? "default" : "destructive"}
                  className={hasCredits ? "bg-green-500" : ""}
                >
                  {creditsRemaining === -1 ? 'Unlimited' : creditsRemaining}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Upload Section */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8">
            {!previewUrl ? (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-green-100 group-hover:to-emerald-100 transition-all duration-300">
                    <ImageIcon className="w-10 h-10 text-gray-400 group-hover:text-green-600 transition-colors duration-300" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {t('Upload Your Food Photo')}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {t('Take a clear photo of your meal and our AI will identify ingredients and calculate nutrition values')}
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      onClick={handleCameraCapture}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      disabled={!hasCredits}
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      {t('Take Photo')}
                    </Button>
                    
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="px-8 py-3 rounded-xl font-medium border-2 hover:bg-gray-50 transition-all duration-300"
                      disabled={!hasCredits}
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      {t('Choose from Gallery')}
                    </Button>
                  </div>
                  
                  {!hasCredits && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">
                        {t('No AI credits remaining. Please upgrade your plan to continue.')}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    {t('Supported formats: JPG, PNG, WebP • Max size: 10MB')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative group">
                  <img
                    src={previewUrl}
                    alt="Food preview"
                    className="max-w-full h-80 object-cover rounded-2xl mx-auto shadow-lg"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetScanner}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                  >
                    ✕
                  </Button>
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-all duration-300" />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !hasCredits}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white flex-1 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t('Analyzing...')}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        {t('Analyze with AI')}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 rounded-xl font-medium border-2"
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
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-800">
                {t('AI is Analyzing Your Food...')}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {t('Our advanced AI is identifying ingredients, calculating nutrition values, and estimating portions')}
              </p>
            </div>
            
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
            <CardTitle className="flex items-center gap-3 text-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
              {t('Analysis Complete')}
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {Math.round((analysisResult.analysis?.overallConfidence || 0.8) * 100)}% Confident
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        {analysisResult.analysis?.foodItems?.map((foodItem: any, index: number) => (
          <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-800 mb-1">{foodItem.name}</h4>
                  <p className="text-gray-600 mb-2">{foodItem.quantity}</p>
                  <Badge variant="outline" className="text-xs">
                    AI Detected
                  </Badge>
                </div>
                
                <Button
                  onClick={() => handleAddFood(foodItem)}
                  disabled={isLoggingConsumption}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {isLoggingConsumption ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    t('Add to Log')
                  )}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl text-center border border-red-200">
                  <p className="text-xs text-red-600 font-medium mb-1">{t('Calories')}</p>
                  <p className="text-2xl font-bold text-red-700">{foodItem.calories || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center border border-blue-200">
                  <p className="text-xs text-blue-600 font-medium mb-1">{t('Protein')}</p>
                  <p className="text-2xl font-bold text-blue-700">{foodItem.protein || 0}g</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl text-center border border-yellow-200">
                  <p className="text-xs text-yellow-600 font-medium mb-1">{t('Carbs')}</p>
                  <p className="text-2xl font-bold text-yellow-700">{foodItem.carbs || 0}g</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center border border-green-200">
                  <p className="text-xs text-green-600 font-medium mb-1">{t('Fat')}</p>
                  <p className="text-2xl font-bold text-green-700">{foodItem.fat || 0}g</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={resetScanner}
            className="flex-1 py-3 rounded-xl font-medium border-2"
          >
            {t('Scan Another')}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-medium border-2"
          >
            {t('Close')}
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'adding') {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-800">
                {t('Adding to Food Log...')}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
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

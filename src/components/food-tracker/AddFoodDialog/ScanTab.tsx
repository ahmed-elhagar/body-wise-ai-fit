
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, AlertCircle } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ScanTabProps {
  onFoodSelected: (food: any) => void;
  onClose: () => void;
}

const ScanTab = ({ onFoodSelected, onClose }: ScanTabProps) => {
  const { t, isRTL } = useI18n();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockFood = {
        name: 'Analyzed Food Item',
        calories: 150,
        protein: 8,
        carbs: 20,
        fat: 5,
        quantity: 100,
        unit: 'g'
      };
      
      setIsAnalyzing(false);
      onFoodSelected(mockFood);
    }, 2000);
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Camera className="w-8 h-8 text-blue-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('foodTracker:scanFood') || 'Scan Your Food'}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('foodTracker:scanDescription') || 'Take a photo or upload an image to analyze your food'}
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full"
                disabled={isAnalyzing}
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isAnalyzing ? t('foodTracker:analyzing') || 'Analyzing...' : t('foodTracker:uploadPhoto') || 'Upload Photo'}
              </Button>
              
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">
                {t('foodTracker:scanTips') || 'Tips for better scanning:'}
              </p>
              <ul className="space-y-1 text-xs">
                <li>• {t('foodTracker:tip1') || 'Use good lighting'}</li>
                <li>• {t('foodTracker:tip2') || 'Place food on a plain background'}</li>
                <li>• {t('foodTracker:tip3') || 'Include a reference object for scale'}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanTab;

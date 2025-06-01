import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Loader2, ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { useI18n } from "@/hooks/useI18n";

interface FoodPhotoAnalysisCardProps {
  onAnalyze: (imageUrl: string) => void;
}

const FoodPhotoAnalysisCard = ({ onAnalyze }: FoodPhotoAnalysisCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useI18n();

  const handleAnalyze = () => {
    if (!imageUrl) {
      toast.error(t('foodPhotoAnalysis.noImageError') || 'Please upload or capture an image first.');
      return;
    }
    setIsLoading(true);
    onAnalyze(imageUrl);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const base64 = await convertToBase64(file);
      setImageUrl(base64);
      toast.success(t('foodPhotoAnalysis.imageUploaded') || 'Image uploaded successfully!');
    } catch (error) {
      console.error("Error converting to base64:", error);
      toast.error(t('foodPhotoAnalysis.uploadFailed') || 'Failed to upload image.');
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({ onDrop, accept: {'image/*': ['.jpeg', '.png', '.jpg']}})

  const handleCapture = () => {
    // Implement camera capture logic here
    toast.info(t('foodPhotoAnalysis.cameraNotImplemented') || 'Camera capture feature is not yet implemented.');
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject("Failed to convert to base64: Result is not a string.");
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t('foodPhotoAnalysis.title') || 'Analyze Food Photo'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div {...getRootProps()} className={`relative border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`}>
          <input {...getInputProps()} />
          {imageUrl ? (
            <img src={imageUrl} alt="Uploaded Food" className="max-h-48 w-full object-contain rounded-md" />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <ImageIcon className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-500">
                {isDragActive
                  ? t('foodPhotoAnalysis.dropHere') || "Drop the image here..."
                  : `${t('foodPhotoAnalysis.dragAndDrop') || "Drag 'n' drop an image here"}, ${t('foodPhotoAnalysis.orClick')} ${t('foodPhotoAnalysis.toSelect')} `}
              </p>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleCapture} variant="outline" className="flex-1">
            <Camera className="w-4 h-4 mr-2" />
            {t('foodPhotoAnalysis.capture')}
          </Button>
          <Button onClick={handleAnalyze} disabled={isLoading} className="flex-1">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('foodPhotoAnalysis.analyzing')}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {t('foodPhotoAnalysis.analyze')}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodPhotoAnalysisCard;

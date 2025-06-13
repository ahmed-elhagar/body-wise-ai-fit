import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, Loader2 } from 'lucide-react';
import { useAIAnalysis } from '@/hooks/useAIAnalysis'; // Using consolidated hook
import { toast } from 'sonner';

const ScanTab = ({ onFoodScanned }: { onFoodScanned: (food: any) => void }) => {
  const { analyzeImage, isAnalyzing } = useAIAnalysis(); // Using consolidated hook
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      setPreviewImage(base64Data);

      try {
        const result = await analyzeImage(base64Data, 'food');
        if (result && result.foodData) {
          onFoodScanned(result.foodData);
          toast.success('Food detected successfully!');
        }
      } catch (error) {
        console.error('Image analysis error:', error);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          {previewImage ? (
            <img src={previewImage} alt="Preview" className="max-h-48 max-w-full rounded-md" />
          ) : (
            <Camera className="h-12 w-12 text-gray-500" />
          )}
          <Button variant="outline" className="mt-4" onClick={handleButtonClick} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </>
            )}
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanTab;

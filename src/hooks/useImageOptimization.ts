
import { useState } from 'react';

interface OptimizedImage {
  thumbnail: string;
  full?: string;
  width: number;
  height: number;
}

export const useImageOptimization = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const optimizeImage = async (file: File, maxWidth: number = 400): Promise<OptimizedImage> => {
    setIsProcessing(true);
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        const width = img.width * ratio;
        const height = img.height * ratio;
        
        // Set canvas size
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
        
        setIsProcessing(false);
        resolve({
          thumbnail,
          width: Math.round(width),
          height: Math.round(height)
        });
      };
      
      img.onerror = () => {
        setIsProcessing(false);
        reject(new Error('Failed to process image'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const generateThumbnail = async (imageUrl: string, maxWidth: number = 200): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        const width = img.width * ratio;
        const height = img.height * ratio;
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      
      img.onerror = () => reject(new Error('Failed to generate thumbnail'));
      img.src = imageUrl;
    });
  };

  return {
    optimizeImage,
    generateThumbnail,
    isProcessing
  };
};

import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useI18n } from "@/hooks/useI18n";

export const useMealImageGeneration = () => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { language } = useI18n();

  const generateMealImage = async (mealName: string, ingredients?: any[]) => {
    setIsGeneratingImage(true);
    
    try {
      console.log('🎨 Generating image for meal:', mealName);
      
      // Show loading toast
      toast.loading('Generating meal image...', { duration: 10000 });

      const ingredientsList = ingredients?.map(ing => 
        typeof ing === 'string' ? ing : ing.name
      ).join(', ') || '';

      const { data, error } = await supabase.functions.invoke('generate-meal-image', {
        body: {
          mealName: mealName,
          ingredients: ingredientsList,
          language: language
        }
      });

      toast.dismiss();

      if (error) {
        console.error('❌ Image generation error:', error);
        throw error;
      }

      if (data?.imageUrl) {
        console.log('✅ Image generated successfully!');
        toast.success('Meal image generated successfully!');
        return data.imageUrl;
      } else {
        throw new Error('No image URL returned');
      }
      
    } catch (error: any) {
      console.error('❌ Error generating meal image:', error);
      toast.dismiss();
      toast.error(error.message || 'Failed to generate meal image');
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return {
    generateMealImage,
    isGeneratingImage
  };
};

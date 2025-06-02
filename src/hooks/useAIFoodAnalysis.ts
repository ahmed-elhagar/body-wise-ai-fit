
import { useState } from 'react';
import { useAuth } from './useAuth';
import { useCreditSystem } from './useCreditSystem';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAIFoodAnalysis = () => {
  const { user } = useAuth();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeFood = async (imageFile: File) => {
    if (!user?.id) {
      console.error('No user ID available for food analysis');
      return null;
    }

    // Check and use credit before starting analysis
    const hasCredit = await checkAndUseCreditAsync();
    if (!hasCredit) {
      toast.error('No AI credits remaining');
      return null;
    }

    setIsAnalyzing(true);
    
    try {
      console.log('🔍 Analyzing food image with AI');
      
      // Upload image and analyze
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('userId', user.id);

      const { data, error } = await supabase.functions.invoke('analyze-food-image', {
        body: formData
      });

      if (error) {
        console.error('❌ Food analysis error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Food analysis completed successfully');
        
        // Complete the generation process
        await completeGenerationAsync();
        
        toast.success('Food analysis completed!');
        return data;
      } else {
        throw new Error(data?.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('❌ Food analysis failed:', error);
      toast.error('Failed to analyze food');
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    analyzeFood
  };
};

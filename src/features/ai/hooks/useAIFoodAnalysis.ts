
import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCentralizedCredits } from '@/shared/hooks/useCentralizedCredits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAIFoodAnalysis = () => {
  const { user } = useAuth();
  const { checkAndUseCredit, completeGeneration } = useCentralizedCredits();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeFood = async (foodDescription: string) => {
    if (!user?.id || !foodDescription.trim()) {
      console.error('Missing required data for food analysis');
      return null;
    }

    const creditResult = await checkAndUseCredit('food-analysis');
    if (!creditResult.success) {
      toast.error('No AI credits remaining');
      return null;
    }

    setIsAnalyzing(true);
    
    try {
      console.log('🍎 Analyzing food with AI');
      
      const { data, error } = await supabase.functions.invoke('analyze-food-description', {
        body: {
          userId: user.id,
          foodDescription: foodDescription
        }
      });

      if (error) {
        console.error('❌ Food analysis error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Food analysis completed successfully');
        
        if (creditResult.logId) {
          await completeGeneration(creditResult.logId, true, data);
        }
        
        return data;
      } else {
        throw new Error(data?.error || 'Food analysis failed');
      }
    } catch (error: any) {
      console.error('❌ Food analysis failed:', error);
      toast.error('Failed to analyze food');
      
      if (creditResult.logId) {
        await completeGeneration(creditResult.logId, false);
      }
      
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeFood,
    isAnalyzing
  };
};

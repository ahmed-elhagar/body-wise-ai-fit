
import { useState } from 'react';
import { useCentralizedCredits } from './useCentralizedCredits';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useRateLimitedAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { checkAndDeductCredits } = useCentralizedCredits();
  const { t } = useLanguage();

  const executeAIAction = async (actionType: string, payload: any) => {
    try {
      setIsLoading(true);
      
      // Check if user has credits
      const hasCredits = await checkAndDeductCredits(1);
      if (!hasCredits) {
        toast.error(t('Insufficient credits for AI operation'));
        return false;
      }

      console.log('🤖 Executing AI action:', actionType, payload);
      
      // Call the appropriate edge function based on action type
      let functionName = '';
      switch (actionType) {
        case 'generate-exercise-program':
        case 'regenerate-exercise-program':
          functionName = 'generate-exercise-program';
          break;
        case 'generate-meal-plan':
          functionName = 'generate-meal-plan';
          break;
        default:
          functionName = actionType;
      }

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      });

      if (error) {
        console.error('❌ AI action failed:', error);
        toast.error(t('AI operation failed. Please try again.'));
        return false;
      }

      if (data?.success) {
        console.log('✅ AI action completed:', actionType);
        toast.success(t('AI operation completed successfully!'));
        return true;
      } else {
        console.error('❌ AI action returned error:', data?.error);
        toast.error(data?.error || t('AI operation failed. Please try again.'));
        return false;
      }
    } catch (error) {
      console.error('❌ AI action failed:', error);
      toast.error(t('AI operation failed. Please try again.'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    executeAIAction,
  };
};

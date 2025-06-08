
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useRateLimitedAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const executeAIAction = async (action: string, payload: any) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    
    try {
      // Check rate limits first
      const { data: rateLimitCheck, error: rateLimitError } = await supabase.functions.invoke(
        'check_and_use_ai_generation',
        {
          body: {
            user_id: user.id,
            action_type: action
          }
        }
      );

      if (rateLimitError) {
        throw new Error(`Rate limit check failed: ${rateLimitError.message}`);
      }

      if (!rateLimitCheck?.allowed) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      // Execute the actual AI action
      let functionName = '';
      switch (action) {
        case 'generate-exercise-program':
          functionName = 'generate-exercise-program';
          break;
        case 'generate-meal-plan':
          functionName = 'generate-meal-plan';
          break;
        case 'exchange-exercise':
          functionName = 'exchange-exercise';
          break;
        default:
          throw new Error(`Unknown AI action: ${action}`);
      }

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      });

      if (error) {
        throw new Error(`AI action failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('AI action error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    executeAIAction,
    isLoading
  };
};

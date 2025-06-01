
import { useState } from 'react';
import { useAuth } from './useAuth';

export const useAIMealPlan = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMealPlan = async (preferences: any) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Check user role from metadata
      const userRole = user?.user_metadata?.role || 'normal';
      
      console.log('Generating meal plan for user role:', userRole);
      
      // Simulate meal plan generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { success: true };
    } catch (err) {
      setError('Failed to generate meal plan');
      return { success: false, error: err };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateMealPlan,
    isGenerating,
    error
  };
};

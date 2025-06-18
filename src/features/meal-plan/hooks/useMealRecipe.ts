
import { useState } from 'react';
import { toast } from 'sonner';
import type { DailyMeal } from '../types';

export const useMealRecipe = () => {
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);

  const generateRecipe = async (mealId: string): Promise<DailyMeal | null> => {
    setIsGeneratingRecipe(true);
    try {
      // Mock implementation - would call actual AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return mock updated meal
      return {
        id: mealId,
        name: 'Sample Meal',
        mealType: 'breakfast',
        calories: 300,
        protein: 15,
        carbs: 30,
        fat: 10,
        ingredients: [
          { name: 'Oats', quantity: '1', unit: 'cup' },
          { name: 'Milk', quantity: '1', unit: 'cup' }
        ],
        instructions: [
          'Combine ingredients',
          'Cook for 5 minutes'
        ],
        alternatives: ['Use almond milk instead'],
        recipeFetched: true,
        image_url: 'https://example.com/meal.jpg'
      };
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast.error('Failed to generate recipe');
      return null;
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  return {
    generateRecipe,
    isGeneratingRecipe
  };
};

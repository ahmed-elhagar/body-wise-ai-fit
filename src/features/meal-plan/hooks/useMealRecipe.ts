import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCentralizedCredits } from '@/shared/hooks/useCentralizedCredits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useMealRecipe = () => {
  const { user } = useAuth();
  const { checkAndUseCredit, completeGeneration } = useCentralizedCredits();
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [existingRecipes, setExistingRecipes] = useState<any[]>([]);

  const searchExistingRecipes = async (mealName: string) => {
    try {
      console.log('🔍 Searching for existing recipes with name:', mealName);
      
      const { data, error } = await supabase
        .from('daily_meals')
        .select('*')
        .ilike('name', `%${mealName}%`)
        .eq('recipe_fetched', true)
        .not('instructions', 'is', null)
        .not('ingredients', 'is', null)
        .limit(3); // Get up to 3 similar recipes

      if (error) {
        console.error('Error searching recipes:', error);
        return [];
      }

      const recipes = data?.filter(meal => 
        meal.instructions && 
        Array.isArray(meal.instructions) && 
        meal.instructions.length > 1 &&
        meal.ingredients &&
        Array.isArray(meal.ingredients) &&
        meal.ingredients.length > 0
      ) || [];

      console.log(`✅ Found ${recipes.length} existing recipes`);
      return recipes;
    } catch (error) {
      console.error('Error searching for existing recipes:', error);
      return [];
    }
  };

  const generateRecipe = async (mealId: string, forceGenerate: boolean = false) => {
    if (!user?.id || !mealId) {
      console.error('Missing required data for recipe generation');
      return null;
    }

    setIsGeneratingRecipe(true);

    try {
      // First, get the current meal details
      const { data: currentMeal, error: mealError } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('id', mealId)
        .single();

      if (mealError || !currentMeal) {
        throw new Error('Meal not found');
      }

      // Check if meal already has detailed recipe
      if (!forceGenerate && 
          currentMeal.recipe_fetched && 
          currentMeal.instructions && 
          Array.isArray(currentMeal.instructions) && 
          currentMeal.instructions.length > 1) {
        console.log('✅ Meal already has detailed recipe');
        setIsGeneratingRecipe(false);
        return currentMeal;
      }

      // Search for existing recipes with similar names
      if (!forceGenerate) {
        const existingRecipes = await searchExistingRecipes(currentMeal.name);
        if (existingRecipes.length > 0) {
          setExistingRecipes(existingRecipes);
          setIsGeneratingRecipe(false);
          
          // Return options for user to choose
          return {
            hasExistingRecipes: true,
            existingRecipes,
            currentMeal,
            message: `Found ${existingRecipes.length} similar recipe(s) in database. Would you like to use one of them or generate a new one?`
          };
        }
      }

      // Check and use credit before starting AI generation
      const creditResult = await checkAndUseCredit('recipe-generation');
      if (!creditResult.success) {
        toast.error('No AI credits remaining for recipe generation');
        setIsGeneratingRecipe(false);
        return null;
      }

      console.log('🍳 Generating new AI recipe for meal:', currentMeal.name);

      const { data, error } = await supabase.functions.invoke('generate-meal-recipe', {
        body: {
          mealId,
          userId: user.id,
          mealName: currentMeal.name,
          currentIngredients: currentMeal.ingredients,
          currentInstructions: currentMeal.instructions,
          generateImage: true,
          enhanceInstructions: true,
          requestDetailedRecipe: true // Flag for enhanced prompting
        }
      });

      if (error) {
        console.error('❌ Recipe generation error:', error);
        throw error;
      }

      if (data?.success && data?.meal) {
        console.log('✅ New AI recipe generated successfully');
        
        // Complete the generation process
        if (creditResult.logId) {
          await completeGeneration(creditResult.logId);
        }
        
        toast.success('Detailed recipe generated successfully!');
        return data.meal;
      } else {
        throw new Error(data?.error || 'Recipe generation failed');
      }
    } catch (error) {
      console.error('❌ Recipe generation failed:', error);
      toast.error('Failed to generate recipe');
      
      throw error;
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  const useExistingRecipe = async (mealId: string, existingRecipe: any) => {
    try {
      console.log('📋 Using existing recipe for meal:', mealId);
      
      // Update the current meal with the existing recipe data
      const { data, error } = await supabase
        .from('daily_meals')
        .update({
          instructions: existingRecipe.instructions,
          ingredients: existingRecipe.ingredients,
          recipe_fetched: true,
          prep_time: existingRecipe.prep_time,
          cook_time: existingRecipe.cook_time,
          image_url: existingRecipe.image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', mealId)
        .select()
        .single();

      if (error) throw error;

      toast.success('Recipe copied from database successfully!');
      return data;
    } catch (error) {
      console.error('❌ Failed to use existing recipe:', error);
      toast.error('Failed to copy recipe');
      throw error;
    }
  };

  return {
    generateRecipe,
    useExistingRecipe,
    isGeneratingRecipe,
    existingRecipes
  };
};

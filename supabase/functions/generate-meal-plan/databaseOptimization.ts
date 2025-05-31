
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enhanced database operations with validation and caching
export const optimizedDatabaseOperations = {
  
  // Check if recipe already exists to avoid duplicate AI calls
  async checkExistingRecipe(mealName: string, calories: number): Promise<any> {
    const { data, error } = await supabase
      .from('daily_meals')
      .select('id, ingredients, instructions, recipe_fetched')
      .eq('name', mealName)
      .eq('calories', calories)
      .eq('recipe_fetched', true)
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking existing recipe:', error);
      return null;
    }
    
    return data;
  },

  // Validate JSONB fields before database insertion
  validateMealData(meal: any): boolean {
    try {
      // Validate ingredients structure
      if (meal.ingredients && !Array.isArray(meal.ingredients)) {
        console.warn('Invalid ingredients format for meal:', meal.name);
        return false;
      }
      
      // Validate instructions structure
      if (meal.instructions && !Array.isArray(meal.instructions)) {
        console.warn('Invalid instructions format for meal:', meal.name);
        return false;
      }
      
      // Validate nutritional values
      if (typeof meal.calories !== 'number' || meal.calories < 0) {
        console.warn('Invalid calories for meal:', meal.name);
        return false;
      }
      
      if (typeof meal.protein !== 'number' || meal.protein < 0) {
        console.warn('Invalid protein for meal:', meal.name);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating meal data:', error);
      return false;
    }
  },

  // Sanitize JSONB fields to prevent injection
  sanitizeJsonFields(data: any): any {
    const sanitized = { ...data };
    
    // Sanitize ingredients
    if (sanitized.ingredients && Array.isArray(sanitized.ingredients)) {
      sanitized.ingredients = sanitized.ingredients.map((ingredient: any) => ({
        name: typeof ingredient.name === 'string' ? ingredient.name.trim() : '',
        quantity: typeof ingredient.quantity === 'string' ? ingredient.quantity.trim() : '',
        unit: typeof ingredient.unit === 'string' ? ingredient.unit.trim() : ''
      }));
    }
    
    // Sanitize instructions
    if (sanitized.instructions && Array.isArray(sanitized.instructions)) {
      sanitized.instructions = sanitized.instructions.map((instruction: any) => 
        typeof instruction === 'string' ? instruction.trim() : ''
      ).filter(Boolean);
    }
    
    return sanitized;
  }
};


import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEnhancedErrorSystem } from './useEnhancedErrorSystem';
import type { WeeklyMealPlan, DailyMeal } from './useMealPlanData';

interface ShoppingListItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

export const useEnhancedShoppingListEmail = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { handleError } = useEnhancedErrorSystem();
  const [isLoading, setIsLoading] = useState(false);

  const generateShoppingItems = useCallback((weeklyPlan: {
    weeklyPlan: WeeklyMealPlan;
    dailyMeals: DailyMeal[];
  } | null): ShoppingListItem[] => {
    if (!weeklyPlan?.dailyMeals) return [];

    const itemsMap = new Map<string, ShoppingListItem>();
    
    weeklyPlan.dailyMeals.forEach(meal => {
      if (meal.ingredients && Array.isArray(meal.ingredients)) {
        meal.ingredients.forEach((ingredient: any) => {
          const ingredientName = ingredient.name || ingredient;
          const quantity = parseFloat(ingredient.quantity || '1');
          const unit = ingredient.unit || 'piece';
          const category = getCategoryForIngredient(ingredientName);
          const key = `${ingredientName.toLowerCase()}-${unit}`;
          
          if (itemsMap.has(key)) {
            const existing = itemsMap.get(key)!;
            existing.quantity += quantity;
          } else {
            itemsMap.set(key, {
              name: ingredientName,
              quantity: quantity,
              unit: unit,
              category
            });
          }
        });
      }
    });

    return Array.from(itemsMap.values());
  }, []);

  const sendShoppingListEmail = useCallback(async (
    weeklyPlan: {
      weeklyPlan: WeeklyMealPlan;
      dailyMeals: DailyMeal[];
    } | null
  ): Promise<boolean> => {
    if (!user || !weeklyPlan) {
      handleError(
        new Error('Missing user or weekly plan data'),
        {
          operation: 'send_shopping_list_email',
          userId: user?.id,
          retryable: false,
          severity: 'medium'
        }
      );
      return false;
    }

    setIsLoading(true);

    try {
      console.log('📧 Starting enhanced shopping list email generation...');
      
      const shoppingItems = generateShoppingItems(weeklyPlan);
      
      if (shoppingItems.length === 0) {
        throw new Error('No shopping items found in meal plan');
      }

      // Group items by category
      const groupedItems = shoppingItems.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, ShoppingListItem[]>);

      const weekRange = `Week of ${weeklyPlan.weeklyPlan.week_start_date}`;

      // Enhanced email data with better formatting
      const emailData = {
        userId: user.id,
        userEmail: user.email,
        weekId: weeklyPlan.weeklyPlan.id,
        shoppingItems: groupedItems,
        weekRange: weekRange,
        totalItems: shoppingItems.length,
        categories: Object.keys(groupedItems),
        language: language,
        generatedAt: new Date().toISOString()
      };

      console.log('📧 Sending shopping list email with data:', {
        totalItems: emailData.totalItems,
        categories: emailData.categories.length,
        language: emailData.language
      });

      const { data, error } = await supabase.functions.invoke('send-shopping-list-email', {
        body: emailData
      });

      if (error) {
        console.error('❌ Shopping list email error:', error);
        throw error;
      }

      console.log('✅ Shopping list email sent successfully:', data);
      
      toast.success(
        language === 'ar' 
          ? `تم إرسال قائمة التسوق (${emailData.totalItems} عنصر) إلى بريدك الإلكتروني!`
          : `Shopping list (${emailData.totalItems} items) sent to your email!`,
        { duration: 5000 }
      );

      return true;
      
    } catch (error: any) {
      console.error('❌ Enhanced shopping list email failed:', error);
      
      handleError(error, {
        operation: 'send_shopping_list_email',
        userId: user.id,
        retryable: true,
        severity: 'high'
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, language, handleError, generateShoppingItems]);

  const validateEmailConfiguration = useCallback(async (): Promise<boolean> => {
    try {
      // Test if the email function is accessible
      const { error } = await supabase.functions.invoke('send-shopping-list-email', {
        body: { test: true }
      });

      return !error || !error.message.includes('Function not found');
    } catch (error) {
      console.warn('Email service validation failed:', error);
      return false;
    }
  }, []);

  return {
    sendShoppingListEmail,
    generateShoppingItems,
    validateEmailConfiguration,
    isLoading
  };
};

const getCategoryForIngredient = (ingredient: string): string => {
  const lowerIngredient = ingredient.toLowerCase();
  
  if (lowerIngredient.includes('meat') || lowerIngredient.includes('chicken') || 
      lowerIngredient.includes('beef') || lowerIngredient.includes('lamb') ||
      lowerIngredient.includes('fish') || lowerIngredient.includes('salmon')) {
    return 'Protein';
  }
  
  if (lowerIngredient.includes('milk') || lowerIngredient.includes('cheese') || 
      lowerIngredient.includes('yogurt') || lowerIngredient.includes('cream')) {
    return 'Dairy';
  }
  
  if (lowerIngredient.includes('apple') || lowerIngredient.includes('banana') || 
      lowerIngredient.includes('orange') || lowerIngredient.includes('berry')) {
    return 'Fruits';
  }
  
  if (lowerIngredient.includes('carrot') || lowerIngredient.includes('onion') || 
      lowerIngredient.includes('tomato') || lowerIngredient.includes('spinach') ||
      lowerIngredient.includes('lettuce') || lowerIngredient.includes('broccoli')) {
    return 'Vegetables';
  }
  
  if (lowerIngredient.includes('rice') || lowerIngredient.includes('bread') || 
      lowerIngredient.includes('pasta') || lowerIngredient.includes('flour') ||
      lowerIngredient.includes('oats') || lowerIngredient.includes('quinoa')) {
    return 'Grains';
  }
  
  if (lowerIngredient.includes('oil') || lowerIngredient.includes('salt') || 
      lowerIngredient.includes('pepper') || lowerIngredient.includes('spice') ||
      lowerIngredient.includes('garlic') || lowerIngredient.includes('herb')) {
    return 'Condiments & Spices';
  }
  
  return 'Other';
};

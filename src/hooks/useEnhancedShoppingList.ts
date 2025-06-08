import { useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { getCategoryForIngredient } from '@/utils/mealPlanUtils';
import { useCentralizedCredits } from './useCentralizedCredits';
import type { WeeklyMealPlan, DailyMeal } from '@/features/meal-plan/types';

export const useEnhancedShoppingList = (weeklyPlan?: {
  weeklyPlan: WeeklyMealPlan;
  dailyMeals: DailyMeal[];
} | null) => {
  const { user } = useAuth();
  const { language } = useLanguage();

  // Enhanced shopping list with optimized performance and better error handling
  const enhancedShoppingItems = useMemo(() => {
    console.log('🛒 Computing enhanced shopping list...', { 
      hasWeeklyPlan: !!weeklyPlan,
      mealsCount: weeklyPlan?.dailyMeals ? (Array.isArray(weeklyPlan.dailyMeals) ? weeklyPlan.dailyMeals.length : 0) : 0 
    });
    
    // Early return with proper error handling
    if (!weeklyPlan?.dailyMeals || !Array.isArray(weeklyPlan.dailyMeals)) {
      console.warn('🛒 No valid meal plan data available');
      return { items: [], groupedItems: {}, totalItems: 0, categories: [] };
    }

    // Use Map for better performance with large ingredient lists
    const itemsMap = new Map<string, any>();
    
    try {
      weeklyPlan.dailyMeals.forEach((meal, mealIndex) => {
        console.log(`🍽️ Processing meal ${mealIndex + 1}: ${meal.name}`);
        
        if (meal.ingredients && Array.isArray(meal.ingredients)) {
          meal.ingredients.forEach((ingredient: any, ingIndex) => {
            try {
              const ingredientName = ingredient.name || ingredient;
              const quantity = parseFloat(ingredient.quantity || '1');
              const unit = ingredient.unit || 'piece';
              const key = `${ingredientName.toLowerCase()}-${unit}`;
              
              console.log(`📝 Processing ingredient ${ingIndex + 1}: ${ingredientName} (${quantity} ${unit})`);
              
              if (itemsMap.has(key)) {
                const existing = itemsMap.get(key)!;
                existing.quantity += quantity;
                console.log(`🔄 Updated existing item: ${ingredientName} (${existing.quantity} ${unit})`);
              } else {
                const newItem = {
                  name: ingredientName,
                  quantity: quantity,
                  unit: unit,
                  category: getCategoryForIngredient(ingredientName)
                };
                itemsMap.set(key, newItem);
                console.log(`➕ Added new item: ${ingredientName} (${quantity} ${unit}) - Category: ${newItem.category}`);
              }
            } catch (error) {
              console.error(`❌ Error processing ingredient ${ingIndex + 1}:`, error);
            }
          });
        }
      });
    } catch (error) {
      console.error('❌ Error processing meals for shopping list:', error);
      return { items: [], groupedItems: {}, totalItems: 0, categories: [] };
    }

    const items = Array.from(itemsMap.values());
    
    // Group by category with better error handling
    const groupedItems = items.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    const categories = Object.keys(groupedItems);

    console.log('🛒 Enhanced shopping items generated:', {
      totalItems: items.length,
      categories: categories.length,
      itemsByCategory: Object.entries(groupedItems).map(([cat, items]) => `${cat}: ${Array.isArray(items) ? items.length : 0}`)
    });
    
    return { 
      items, 
      groupedItems, 
      totalItems: items.length,
      categories
    };
  }, [weeklyPlan?.dailyMeals]);

  // Optimized email sending with better error handling
  const sendShoppingListEmail = useCallback(async () => {
    if (!user || !weeklyPlan) {
      console.error('❌ Missing data for email sending:', { hasUser: !!user, hasWeeklyPlan: !!weeklyPlan });
      toast.error('Unable to send email - missing data');
      return false;
    }

    if (enhancedShoppingItems.totalItems === 0) {
      toast.error('No items in shopping list to send');
      return false;
    }

    try {
      console.log('📧 Preparing shopping list email...', {
        userId: user.id,
        weeklyPlanId: weeklyPlan.weeklyPlan.id,
        itemsCount: enhancedShoppingItems.totalItems
      });

      const weekRange = `Week of ${weeklyPlan.weeklyPlan.week_start_date}`;

      const emailData = {
        userId: user.id,
        userEmail: user.email,
        weekId: weeklyPlan.weeklyPlan.id,
        shoppingItems: enhancedShoppingItems.groupedItems,
        weekRange: weekRange,
        totalItems: enhancedShoppingItems.totalItems,
        categories: enhancedShoppingItems.categories,
        language,
        generatedAt: new Date().toISOString()
      };

      console.log('📤 Sending shopping list email with data:', emailData);

      // Show loading toast with timeout
      const loadingToast = toast.loading('Sending shopping list email...', { duration: 10000 });

      const { data, error } = await supabase.functions.invoke('send-shopping-list-email', {
        body: emailData
      });

      toast.dismiss(loadingToast);

      if (error) {
        console.error('❌ Email sending error:', error);
        toast.error(`Failed to send email: ${error.message || 'Unknown error'}`);
        return false;
      }

      if (data?.success) {
        console.log('✅ Shopping list email sent successfully!', data);
        toast.success('Shopping list sent to your email!');
        return true;
      } else {
        console.error('❌ Email sending failed:', data);
        toast.error(data?.error || 'Failed to send shopping list email');
        return false;
      }
      
    } catch (error: any) {
      console.error('❌ Error sending shopping list email:', error);
      toast.dismiss();
      toast.error(error.message || 'Failed to send shopping list email');
      return false;
    }
  }, [user, weeklyPlan, enhancedShoppingItems]);

  return {
    enhancedShoppingItems,
    sendShoppingListEmail,
    isLoading: false, // Add loading state
    error: null // Add error state
  };
};

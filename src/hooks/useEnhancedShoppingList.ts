
import { useMemo } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useI18n } from '@/hooks/useI18n';
import { getCategoryForIngredient } from '@/utils/mealPlanUtils';
import type { WeeklyMealPlan, DailyMeal } from '@/hooks/useMealPlanData';

export const useEnhancedShoppingList = (weeklyPlan?: {
  weeklyPlan: WeeklyMealPlan;
  dailyMeals: DailyMeal[];
} | null) => {
  const { user } = useAuth();
  const { language } = useI18n();

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

      const items = Array.from(itemsMap.values());
      console.log('🛒 Generated shopping items:', items.length);

      // Enhanced grouping with better category management
      const groupedItems = items.reduce((acc, item) => {
        const category = item.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        return acc;
      }, {} as Record<string, any[]>);

      const categories = Object.keys(groupedItems).sort();
      console.log('📂 Categories found:', categories);

      return {
        items,
        groupedItems,
        totalItems: items.length,
        categories
      };
    } catch (error) {
      console.error('❌ Error computing enhanced shopping list:', error);
      return { items: [], groupedItems: {}, totalItems: 0, categories: [] };
    }
  }, [weeklyPlan?.dailyMeals]);

  const sendShoppingListEmail = async () => {
    if (!user?.id || !weeklyPlan) {
      toast.error(language === 'ar' ? 'لا توجد بيانات كافية لإرسال البريد الإلكتروني' : 'No data available to send email');
      return false;
    }

    try {
      console.log('📧 Sending enhanced shopping list email...');
      
      const { data, error } = await supabase.functions.invoke('send-shopping-list-email', {
        body: {
          userId: user.id,
          shoppingItems: enhancedShoppingItems.items,
          groupedItems: enhancedShoppingItems.groupedItems,
          weekId: weeklyPlan.weeklyPlan.id,
          language: language
        }
      });

      if (error) throw error;

      toast.success(language === 'ar' ? 'تم إرسال قائمة التسوق بالبريد الإلكتروني بنجاح!' : 'Shopping list sent to email successfully!');
      console.log('✅ Enhanced shopping list email sent successfully');
      return true;
    } catch (error) {
      console.error('❌ Error sending enhanced shopping list email:', error);
      toast.error(language === 'ar' ? 'فشل في إرسال البريد الإلكتروني' : 'Failed to send email');
      return false;
    }
  };

  return {
    enhancedShoppingItems,
    sendShoppingListEmail
  };
};

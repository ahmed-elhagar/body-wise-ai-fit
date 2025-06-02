
import { useMemo } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategoryForIngredient } from '@/utils/mealPlanUtils';
import type { WeeklyMealPlan, DailyMeal } from '@/hooks/useMealPlanData';

export const useEnhancedShoppingList = (weeklyPlan?: {
  weeklyPlan: WeeklyMealPlan;
  dailyMeals: DailyMeal[];
} | null) => {
  const { user } = useAuth();
  const { language } = useLanguage();

  // Enhanced shopping list with proper aggregation and categorization
  const enhancedShoppingItems = useMemo(() => {
    console.log('🛒 Computing enhanced shopping list...', { 
      hasWeeklyPlan: !!weeklyPlan,
      mealsCount: weeklyPlan?.dailyMeals?.length || 0 
    });
    
    if (!weeklyPlan?.dailyMeals) {
      return { items: [], groupedItems: {} };
    }

    const itemsMap = new Map<string, any>();
    
    weeklyPlan.dailyMeals.forEach((meal, mealIndex) => {
      console.log(`🍽️ Processing meal ${mealIndex + 1}: ${meal.name}`);
      
      if (meal.ingredients && Array.isArray(meal.ingredients)) {
        meal.ingredients.forEach((ingredient: any, ingIndex) => {
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
        });
      }
    });

    const items = Array.from(itemsMap.values());
    
    // Group by category
    const groupedItems = items.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    console.log('🛒 Enhanced shopping items generated:', {
      totalItems: items.length,
      categories: Object.keys(groupedItems).length,
      itemsByCategory: Object.entries(groupedItems).map(([cat, items]) => `${cat}: ${items.length}`)
    });
    
    return { items, groupedItems };
  }, [weeklyPlan?.dailyMeals]);

  const sendShoppingListEmail = async () => {
    if (!user || !weeklyPlan) {
      console.error('❌ Missing data for email sending:', { hasUser: !!user, hasWeeklyPlan: !!weeklyPlan });
      toast.error('Unable to send email - missing data');
      return false;
    }

    try {
      console.log('📧 Preparing shopping list email...', {
        userId: user.id,
        weeklyPlanId: weeklyPlan.weeklyPlan.id,
        itemsCount: enhancedShoppingItems.items.length
      });

      const weekRange = `Week of ${weeklyPlan.weeklyPlan.week_start_date}`;

      const emailData = {
        userId: user.id,
        userEmail: user.email,
        weekId: weeklyPlan.weeklyPlan.id,
        shoppingItems: enhancedShoppingItems.groupedItems,
        weekRange: weekRange,
        totalItems: enhancedShoppingItems.items.length,
        categories: Object.keys(enhancedShoppingItems.groupedItems),
        language,
        generatedAt: new Date().toISOString()
      };

      console.log('📤 Sending shopping list email with data:', emailData);

      toast.loading('Sending shopping list email...', { duration: 10000 });

      const { data, error } = await supabase.functions.invoke('send-shopping-list-email', {
        body: emailData
      });

      toast.dismiss();

      if (error) {
        console.error('❌ Email sending error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Shopping list email sent successfully!', data);
        toast.success('Shopping list sent to your email!');
        return true;
      } else {
        console.error('❌ Email sending failed:', data);
        toast.error('Failed to send shopping list email');
        return false;
      }
      
    } catch (error: any) {
      console.error('❌ Error sending shopping list email:', error);
      toast.dismiss();
      toast.error(error.message || 'Failed to send shopping list email');
      return false;
    }
  };

  return {
    enhancedShoppingItems,
    sendShoppingListEmail
  };
};

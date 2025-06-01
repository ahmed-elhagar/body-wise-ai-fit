import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useI18n } from "@/hooks/useI18n";
import { getCategoryForIngredient } from '@/utils/mealPlanUtils';
import type { WeeklyMealPlan, DailyMeal } from '@/hooks/useMealPlanData';

export const useEnhancedShoppingList = (weeklyPlan?: {
  weeklyPlan: WeeklyMealPlan;
  dailyMeals: DailyMeal[];
} | null) => {
  const { t, language } = useI18n();

  // Enhanced shopping list with proper aggregation and categorization
  const enhancedShoppingItems = useMemo(() => {
    console.log('🛒 Computing enhanced shopping list...');
    
    if (!weeklyPlan?.dailyMeals) {
      return { items: [], groupedItems: {} };
    }

    const itemsMap = new Map<string, any>();
    
    weeklyPlan.dailyMeals.forEach(meal => {
      if (meal.ingredients && Array.isArray(meal.ingredients)) {
        meal.ingredients.forEach((ingredient: any) => {
          const ingredientName = ingredient.name || ingredient;
          const quantity = parseFloat(ingredient.quantity || '1');
          const unit = ingredient.unit || 'piece';
          const key = `${ingredientName.toLowerCase()}-${unit}`;
          
          if (itemsMap.has(key)) {
            const existing = itemsMap.get(key)!;
            existing.quantity += quantity;
          } else {
            itemsMap.set(key, {
              name: ingredientName,
              quantity: quantity,
              unit: unit,
              category: getCategoryForIngredient(ingredientName)
            });
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

    console.log('🛒 Enhanced shopping items generated:', items.length);
    return { items, groupedItems };
  }, [weeklyPlan?.dailyMeals]);

  const sendShoppingListEmail = async () => {
    if (!weeklyPlan) {
      toast.error('Unable to send email - missing data');
      return false;
    }

    try {
      console.log('📧 Sending shopping list email...');
      toast.loading('Sending shopping list email...', { duration: 10000 });

      const weekRange = `Week of ${weeklyPlan.weeklyPlan.week_start_date}`;

      const { data, error } = await supabase.functions.invoke('send-shopping-list-email', {
        body: {
          shoppingItems: enhancedShoppingItems.groupedItems,
          weekRange: weekRange
        }
      });

      toast.dismiss();

      if (error) {
        console.error('❌ Email sending error:', error);
        throw error;
      }

      console.log('✅ Shopping list email sent successfully!');
      toast.success('Shopping list sent to your email!');
      return true;
      
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


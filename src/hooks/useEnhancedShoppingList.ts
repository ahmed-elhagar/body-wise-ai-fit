
import { useMemo } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategoryForIngredient } from '@/utils/mealPlanUtils';
import type { ShoppingItem, ShoppingListData } from '@/types/shoppingList';

interface Ingredient {
  name: string;
  quantity?: string | number;
  unit?: string;
}

export const useEnhancedShoppingList = (mealPlanData?: any) => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const enhancedShoppingItems: ShoppingListData = useMemo(() => {
    console.log('🛒 Computing enhanced shopping list...', { 
      hasMealPlanData: !!mealPlanData,
      hasWeeklyPlan: !!mealPlanData?.weeklyPlan,
      mealsCount: mealPlanData?.dailyMeals ? mealPlanData.dailyMeals.length : 0,
      dailyMeals: mealPlanData?.dailyMeals?.slice(0, 3)?.map((meal: any) => ({
        name: meal.name,
        hasIngredients: !!meal.ingredients,
        ingredientsType: typeof meal.ingredients
      }))
    });
    
    if (!mealPlanData?.dailyMeals || !Array.isArray(mealPlanData.dailyMeals)) {
      console.log('❌ No daily meals found in meal plan data');
      return { items: [], groupedItems: {} };
    }

    const itemsMap = new Map<string, ShoppingItem>();
    
    mealPlanData.dailyMeals.forEach((meal: any, mealIndex: number) => {
      console.log(`🍽️ Processing meal ${mealIndex + 1}: ${meal.name}`, {
        hasIngredients: !!meal.ingredients,
        ingredientsType: typeof meal.ingredients,
        ingredientsLength: Array.isArray(meal.ingredients) ? meal.ingredients.length : 'not array',
        ingredientsPreview: meal.ingredients
      });
      
      if (!meal.ingredients) {
        console.log(`⚠️ No ingredients found for meal: ${meal.name}`);
        return;
      }

      let ingredientsArray: Ingredient[] = [];
      
      // Handle different ingredient formats more robustly
      try {
        if (Array.isArray(meal.ingredients)) {
          ingredientsArray = meal.ingredients;
        } else if (typeof meal.ingredients === 'string') {
          const parsed = JSON.parse(meal.ingredients);
          if (Array.isArray(parsed)) {
            ingredientsArray = parsed;
          } else {
            console.warn(`Parsed ingredients is not an array for ${meal.name}:`, parsed);
          }
        } else if (typeof meal.ingredients === 'object' && meal.ingredients !== null) {
          // Convert object to array format
          ingredientsArray = Object.values(meal.ingredients).filter(
            (item): item is Ingredient => 
              typeof item === 'object' && 
              item !== null && 
              'name' in item
          );
        }
      } catch (error) {
        console.error(`Failed to process ingredients for ${meal.name}:`, error);
        return;
      }

      console.log(`📝 Processing ${ingredientsArray.length} ingredients for ${meal.name}`);

      ingredientsArray.forEach((ingredient: any, ingIndex) => {
        // More robust ingredient processing
        let ingredientData: Ingredient;
        
        if (typeof ingredient === 'string') {
          ingredientData = { name: ingredient, quantity: 1, unit: 'piece' };
        } else if (ingredient && typeof ingredient === 'object' && 'name' in ingredient) {
          ingredientData = {
            name: ingredient.name,
            quantity: ingredient.quantity || 1,
            unit: ingredient.unit || 'piece'
          };
        } else {
          console.warn(`Invalid ingredient at index ${ingIndex} in ${meal.name}:`, ingredient);
          return;
        }

        const ingredientName = String(ingredientData.name).trim();
        if (!ingredientName) {
          console.warn(`Empty ingredient name in ${meal.name}`);
          return;
        }

        // Convert quantity to number
        let quantity = 1;
        if (typeof ingredientData.quantity === 'number') {
          quantity = ingredientData.quantity;
        } else if (typeof ingredientData.quantity === 'string') {
          const parsed = parseFloat(ingredientData.quantity);
          quantity = isNaN(parsed) ? 1 : parsed;
        }

        const unit = String(ingredientData.unit || 'piece');
        const key = `${ingredientName.toLowerCase()}-${unit.toLowerCase()}`;
        
        console.log(`📦 Processing: ${ingredientName} (${quantity} ${unit})`);
        
        if (itemsMap.has(key)) {
          const existing = itemsMap.get(key)!;
          existing.quantity += quantity;
          console.log(`🔄 Updated existing: ${ingredientName} -> ${existing.quantity} ${unit}`);
        } else {
          const newItem: ShoppingItem = {
            name: ingredientName,
            quantity: quantity,
            unit: unit,
            category: getCategoryForIngredient(ingredientName)
          };
          itemsMap.set(key, newItem);
          console.log(`➕ Added new: ${ingredientName} (${quantity} ${unit}) - Category: ${newItem.category}`);
        }
      });
    });

    const items = Array.from(itemsMap.values());
    
    const groupedItems = items.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, ShoppingItem[]>);

    console.log('✅ Shopping list generation complete:', {
      totalItems: items.length,
      categories: Object.keys(groupedItems).length,
      itemsByCategory: Object.entries(groupedItems).map(([cat, items]) => `${cat}: ${items.length}`)
    });
    
    return { items, groupedItems };
  }, [mealPlanData?.dailyMeals]);

  const sendShoppingListEmail = async () => {
    if (!user || !mealPlanData) {
      console.error('❌ Missing data for email sending:', { hasUser: !!user, hasMealPlanData: !!mealPlanData });
      toast.error('Unable to send email - missing data');
      return false;
    }

    try {
      console.log('📧 Preparing shopping list email...', {
        userId: user.id,
        weeklyPlanId: mealPlanData.weeklyPlan?.id,
        itemsCount: enhancedShoppingItems.items.length
      });

      const weekRange = `Week of ${mealPlanData.weeklyPlan?.week_start_date}`;

      const emailData = {
        userId: user.id,
        userEmail: user.email,
        weekId: mealPlanData.weeklyPlan?.id,
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

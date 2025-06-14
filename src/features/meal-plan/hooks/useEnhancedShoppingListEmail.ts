
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import type { MealPlanFetchResult } from '@/features/meal-plan/types';

export const useEnhancedShoppingListEmail = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const sendShoppingListEmail = async (weeklyPlan: MealPlanFetchResult | null): Promise<boolean> => {
    if (!user?.email || !weeklyPlan?.weeklyPlan) {
      toast.error(
        language === 'ar' 
          ? 'لا توجد خطة وجبات أو بريد إلكتروني'
          : 'No meal plan or email found'
      );
      return false;
    }

    setIsLoading(true);

    try {
      // Generate shopping items from meals
      const shoppingItems: Record<string, Array<{ name: string; quantity: number; unit: string }>> = {};
      
      if (weeklyPlan.dailyMeals) {
        weeklyPlan.dailyMeals.forEach(meal => {
          if (meal.ingredients) {
            const ingredients = Array.isArray(meal.ingredients) ? meal.ingredients : [];
            ingredients.forEach((ingredient: any) => {
              const category = ingredient.category || 'Other';
              if (!shoppingItems[category]) {
                shoppingItems[category] = [];
              }
              shoppingItems[category].push({
                name: ingredient.name || ingredient.ingredient || 'Unknown',
                quantity: ingredient.quantity || 1,
                unit: ingredient.unit || 'piece'
              });
            });
          }
        });
      }

      const totalItems = Object.values(shoppingItems).reduce((total, items) => total + items.length, 0);
      const categories = Object.keys(shoppingItems);

      const emailData = {
        userId: user.id,
        userEmail: user.email,
        weekId: weeklyPlan.weeklyPlan.id,
        shoppingItems,
        weekRange: `Week of ${weeklyPlan.weeklyPlan.week_start_date}`,
        totalItems,
        categories,
        language,
        generatedAt: new Date().toISOString()
      };

      console.log('📧 Sending shopping list email:', {
        userId: user.id,
        totalItems,
        categories: categories.length
      });

      const { data, error } = await supabase.functions.invoke('send-shopping-list-email', {
        body: emailData
      });

      if (error) {
        console.error('❌ Error sending shopping list email:', error);
        toast.error(
          language === 'ar'
            ? 'فشل في إرسال قائمة التسوق'
            : 'Failed to send shopping list'
        );
        return false;
      }

      if (data?.success) {
        toast.success(
          language === 'ar'
            ? 'تم إرسال قائمة التسوق بنجاح!'
            : 'Shopping list sent successfully!'
        );
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('❌ Exception sending shopping list email:', error);
      toast.error(
        language === 'ar'
          ? 'حدث خطأ أثناء إرسال قائمة التسوق'
          : 'Error sending shopping list'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendShoppingListEmail,
    isLoading
  };
};

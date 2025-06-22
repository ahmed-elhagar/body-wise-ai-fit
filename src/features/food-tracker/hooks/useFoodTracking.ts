
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuth'; // This global hook is fine
import { toast } from 'sonner';

export interface FoodConsumption {
  id: string;
  user_id: string;
  food_item_id: string;
  quantity_g: number;
  calories_consumed: number;
  protein_consumed: number;
  carbs_consumed: number;
  fat_consumed: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  consumed_at: string;
  notes?: string;
  meal_image_url?: string;
  source: 'manual' | 'ai_analysis' | 'barcode';
  food_item?: {
    name: string;
    brand?: string;
    calories_per_100g: number;
    protein_per_100g: number;
    carbs_per_100g: number;
    fat_per_100g: number;
  };
}

export const useFoodTracking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: foodConsumption, isLoading } = useQuery({
    queryKey: ['food-consumption', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('food_consumption_log')
        .select(`
          *,
          food_item:food_items (
            name,
            brand,
            calories_per_100g,
            protein_per_100g,
            carbs_per_100g,
            fat_per_100g
          )
        `)
        .eq('user_id', user.id)
        .order('consumed_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as FoodConsumption[];
    },
    enabled: !!user?.id,
  });

  const addFoodConsumption = useMutation({
    mutationFn: async (consumption: Omit<FoodConsumption, 'id' | 'user_id'>) => {
      const { error } = await supabase
        .from('food_consumption_log')
        .insert({
          user_id: user?.id,
          ...consumption,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-consumption', user?.id] });
      toast.success('Food logged successfully!');
    },
  });

  const getTodaysConsumption = () => {
    if (!foodConsumption) return [];
    
    const today = new Date().toISOString().split('T')[0];
    return foodConsumption.filter(item => 
      item.consumed_at.startsWith(today)
    );
  };

  const getNutritionSummary = (date?: string) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const dayConsumption = foodConsumption?.filter(item => 
      item.consumed_at.startsWith(targetDate)
    ) || [];

    return {
      totalCalories: dayConsumption.reduce((sum, item) => sum + item.calories_consumed, 0),
      totalProtein: dayConsumption.reduce((sum, item) => sum + item.protein_consumed, 0),
      totalCarbs: dayConsumption.reduce((sum, item) => sum + item.carbs_consumed, 0),
      totalFat: dayConsumption.reduce((sum, item) => sum + item.fat_consumed, 0),
      mealBreakdown: {
        breakfast: dayConsumption.filter(item => item.meal_type === 'breakfast'),
        lunch: dayConsumption.filter(item => item.meal_type === 'lunch'),
        dinner: dayConsumption.filter(item => item.meal_type === 'dinner'),
        snack: dayConsumption.filter(item => item.meal_type === 'snack'),
      },
    };
  };

  const getWeeklyTrend = () => {
    if (!foodConsumption) return [];
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const summary = getNutritionSummary(date);
      return {
        date,
        ...summary,
      };
    });
  };

  return {
    foodConsumption: foodConsumption || [],
    isLoading,
    addFoodConsumption: addFoodConsumption.mutate,
    isAdding: addFoodConsumption.isPending,
    getTodaysConsumption,
    getNutritionSummary,
    getWeeklyTrend,
  };
};

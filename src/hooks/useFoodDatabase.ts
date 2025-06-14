
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const useFoodDatabase = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const searchFoodItems = (searchTerm: string, category?: string) => {
    return useQuery({
      queryKey: ['food-search', searchTerm, category],
      queryFn: async () => {
        if (!searchTerm || searchTerm.length < 2) return [];
        
        let query = supabase
          .from('food_items')
          .select('*')
          .ilike('name', `%${searchTerm}%`)
          .limit(20);
        
        if (category && category !== 'all') {
          query = query.eq('category', category);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      },
      enabled: searchTerm.length >= 2,
    });
  };

  const { data: favoriteFoods, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['favorite-foods', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_favorite_foods')
        .select(`
          *,
          food_item:food_items(*)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { mutate: addToFavorites, isPending: isAddingToFavorites } = useMutation({
    mutationFn: async ({ foodItemId, customName }: { foodItemId: string; customName?: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('user_favorite_foods')
        .insert({
          user_id: user.id,
          food_item_id: foodItemId,
          custom_name: customName
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Added to favorites!');
      queryClient.invalidateQueries({ queryKey: ['favorite-foods'] });
    },
    onError: (error) => {
      console.error('Error adding to favorites:', error);
      toast.error('Failed to add to favorites');
    }
  });

  return {
    searchFoodItems,
    favoriteFoods,
    isLoadingFavorites,
    addToFavorites,
    isAddingToFavorites
  };
};

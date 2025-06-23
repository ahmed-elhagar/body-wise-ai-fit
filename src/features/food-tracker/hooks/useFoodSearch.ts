
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  sodium_per_100g?: number;
  verified: boolean;
}

export const useFoodSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);

  const { 
    data, 
    isLoading: isSearching, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['food-search', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];

      const { data, error } = await supabase
        .from('food_items')
        .select(`
          id,
          name,
          brand,
          category,
          calories_per_100g,
          protein_per_100g,
          carbs_per_100g,
          fat_per_100g,
          fiber_per_100g,
          sugar_per_100g,
          sodium_per_100g,
          verified
        `)
        .or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`)
        .order('verified', { ascending: false })
        .order('name')
        .limit(20);

      if (error) {
        console.error('Error searching foods:', error);
        throw error;
      }

      return data as FoodItem[];
    },
    enabled: false, // Only run when manually triggered
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const searchFood = async (term: string) => {
    setSearchTerm(term);
    const result = await refetch();
    setSearchResults(result.data || []);
  };

  return {
    searchResults,
    isSearching,
    error,
    searchFood,
  };
};

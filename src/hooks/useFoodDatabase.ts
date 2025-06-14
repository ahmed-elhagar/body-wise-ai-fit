
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FoodItem {
  id: string;
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  sodium_per_100g?: number;
  brand?: string;
  category?: string;
  barcode?: string;
}

export const useFoodDatabase = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['food-search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];

      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .ilike('name', `%${searchQuery}%`)
        .limit(20);

      if (error) throw error;
      return data as FoodItem[];
    },
    enabled: searchQuery.length >= 2
  });

  const searchFood = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    searchFood,
    searchResults,
    isLoading,
    isSearching: isLoading
  };
};

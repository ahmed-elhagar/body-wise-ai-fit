
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { FoodItem, FoodSearchFilters } from '../types';

export const useFoodSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FoodSearchFilters>({});

  const {
    data: searchResults = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['food-search', searchTerm, filters],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];

      let query = supabase
        .from('food_items')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .limit(20);

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.verified !== undefined) {
        query = query.eq('verified', filters.verified);
      }
      if (filters.brand) {
        query = query.ilike('brand', `%${filters.brand}%`);
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'name';
      const sortOrder = filters.sortOrder || 'asc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      const { data, error } = await query;

      if (error) throw error;
      return data as FoodItem[];
    },
    enabled: searchTerm.trim().length > 0,
  });

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    searchResults,
    isLoading,
    error,
  };
};

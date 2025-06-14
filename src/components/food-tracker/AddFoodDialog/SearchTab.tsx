
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import { useFoodDatabase } from "@/hooks/useFoodDatabase";
import { useFoodTracking } from "@/hooks/useFoodTracking";
import { useTranslation } from 'react-i18next';

interface SearchTabProps {
  onFoodAdded: () => void;
}

export const SearchTab = ({ onFoodAdded }: SearchTabProps) => {
  const { t } = useTranslation('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(100);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  
  const { searchFood, searchResults, isLoading } = useFoodDatabase();
  const { logFood } = useFoodTracking();

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchFood(searchQuery);
    }
  }, [searchQuery, searchFood]);

  const handleAddFood = async (foodItem: any) => {
    try {
      const success = await logFood({
        food_name: foodItem.name,
        quantity: selectedQuantity,
        meal_type: selectedMealType,
        calories: Math.round((foodItem.calories_per_100g * selectedQuantity) / 100),
        protein: Math.round((foodItem.protein_per_100g * selectedQuantity) / 100),
        carbs: Math.round((foodItem.carbs_per_100g * selectedQuantity) / 100),
        fat: Math.round((foodItem.fat_per_100g * selectedQuantity) / 100),
        logged_at: new Date().toISOString()
      });
      
      if (success) {
        onFoodAdded();
      }
    } catch (error) {
      console.error('Error adding food:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={t('search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && (
        <div className="text-center py-4 text-gray-500">
          {t('loading')}...
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {searchResults.map((item) => (
            <Card key={item.id} className="cursor-pointer hover:bg-gray-50">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    {item.brand && <p className="text-sm text-gray-500">{item.brand}</p>}
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{item.calories_per_100g} cal/100g</Badge>
                      <Badge variant="outline">{item.protein_per_100g}g protein</Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddFood(item)}
                    className="ml-2"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searchQuery.length >= 2 && !isLoading && searchResults.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No food items found for "{searchQuery}"
        </div>
      )}
    </div>
  );
};

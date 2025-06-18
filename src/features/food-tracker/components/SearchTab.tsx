
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import { useFoodSearch } from '../hooks/useFoodSearch';
import { useFoodTracking } from '../hooks/useFoodTracking';

interface SearchTabProps {
  onFoodAdded: () => void;
  onClose: () => void;
}

const SearchTab = ({ onFoodAdded, onClose }: SearchTabProps) => {
  const { searchTerm, setSearchTerm, searchResults, isLoading } = useFoodSearch();
  const { addFoodConsumption, isAdding } = useFoodTracking();

  const handleAddFood = (foodItem: any) => {
    const foodConsumption = {
      food_item_id: foodItem.id,
      quantity_g: 100,
      calories_consumed: foodItem.calories_per_100g,
      protein_consumed: foodItem.protein_per_100g,
      carbs_consumed: foodItem.carbs_per_100g,
      fat_consumed: foodItem.fat_per_100g,
      meal_type: 'snack' as const,
      consumed_at: new Date().toISOString(),
      source: 'manual' as const,
      food_item: foodItem,
    };

    addFoodConsumption(foodConsumption);
    onFoodAdded();
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search for food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {isLoading && (
          <div className="text-center py-4 text-gray-500">
            Searching...
          </div>
        )}

        {searchResults.map((food) => (
          <Card key={food.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{food.name}</h4>
                {food.brand && (
                  <p className="text-sm text-gray-500">{food.brand}</p>
                )}
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span>{food.calories_per_100g} cal</span>
                  <span>{food.protein_per_100g}g protein</span>
                  <span>{food.carbs_per_100g}g carbs</span>
                  <span>{food.fat_per_100g}g fat</span>
                </div>
              </div>
              
              <Button
                onClick={() => handleAddFood(food)}
                disabled={isAdding}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </Card>
        ))}

        {searchTerm && !isLoading && searchResults.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No food items found for "{searchTerm}"</p>
            <p className="text-sm mt-1">Try different keywords or add manually</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTab;

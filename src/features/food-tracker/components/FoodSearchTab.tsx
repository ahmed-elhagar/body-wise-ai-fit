
import React, { useState } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useFoodSearch } from '../hooks/useFoodSearch';
import { useFoodConsumption } from '../hooks/useFoodConsumption';
import FoodItemModal from './FoodItemModal';

interface FoodSearchTabProps {
  onFoodAdded: () => void;
}

const FoodSearchTab: React.FC<FoodSearchTabProps> = ({ onFoodAdded }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { searchResults, isSearching, searchFood } = useFoodSearch();
  const { addConsumption, isAddingConsumption } = useFoodConsumption();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchFood(searchTerm.trim());
    }
  };

  const handleSelectFood = (food: any) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  const handleAddFood = async (foodData: any) => {
    try {
      // First, ensure the food item exists in our database
      let foodItemId = foodData.id;
      
      if (!foodItemId) {
        // Create new food item if it doesn't exist
        const { data: newFoodItem, error } = await supabase
          .from('food_items')
          .insert({
            name: foodData.name,
            brand: foodData.brand,
            category: foodData.category || 'general',
            calories_per_100g: foodData.calories_per_100g,
            protein_per_100g: foodData.protein_per_100g,
            carbs_per_100g: foodData.carbs_per_100g,
            fat_per_100g: foodData.fat_per_100g,
            source: 'manual'
          })
          .select()
          .single();

        if (error) throw error;
        foodItemId = newFoodItem.id;
      }

      // Calculate consumption based on quantity
      const quantity = foodData.quantity || 100;
      const multiplier = quantity / 100;

      await addConsumption({
        food_item_id: foodItemId,
        quantity_g: quantity,
        calories_consumed: foodData.calories_per_100g * multiplier,
        protein_consumed: foodData.protein_per_100g * multiplier,
        carbs_consumed: foodData.carbs_per_100g * multiplier,
        fat_consumed: foodData.fat_per_100g * multiplier,
        meal_type: foodData.meal_type || 'snack',
        source: 'manual',
        notes: foodData.notes,
        consumed_at: new Date().toISOString()
      });

      setIsModalOpen(false);
      setSelectedFood(null);
      onFoodAdded();
    } catch (error) {
      console.error('Error adding food:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for foods (e.g., apple, chicken breast, rice)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          type="submit" 
          disabled={!searchTerm.trim() || isSearching}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </form>

      {/* Search Results */}
      {isSearching && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600 mb-2" />
          <p className="text-gray-600">Searching for foods...</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Search Results</h3>
          {searchResults.map((food) => (
            <Card 
              key={food.id} 
              className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleSelectFood(food)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{food.name}</h4>
                      {food.brand && (
                        <Badge variant="outline" className="text-xs">
                          {food.brand}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                        {food.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{food.calories_per_100g} cal/100g</span>
                      <span>•</span>
                      <span>P: {food.protein_per_100g}g</span>
                      <span>•</span>
                      <span>C: {food.carbs_per_100g}g</span>
                      <span>•</span>
                      <span>F: {food.fat_per_100g}g</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectFood(food);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searchTerm && !isSearching && searchResults.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No foods found for "{searchTerm}"</p>
          <p className="text-sm mt-1">Try searching with different keywords</p>
        </div>
      )}

      {/* Food Item Modal */}
      <FoodItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFood(null);
        }}
        food={selectedFood}
        onAddFood={handleAddFood}
        isAdding={isAddingConsumption}
      />
    </div>
  );
};

export default FoodSearchTab;

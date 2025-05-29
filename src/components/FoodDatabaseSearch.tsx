
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FoodItem {
  id: string;
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  serving_size_g: number;
  serving_description?: string;
  confidence_score: number;
  cuisine_type: string;
  category: string;
  verified: boolean;
}

interface FoodDatabaseSearchProps {
  onAddFood?: (food: FoodItem) => void;
}

const FoodDatabaseSearch = ({ onAddFood }: FoodDatabaseSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: foodItems, isLoading } = useQuery({
    queryKey: ['centralized-food-search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];
      
      // Use the optimized search function that only searches food_items
      const { data, error } = await supabase.rpc('search_food_items', {
        search_term: searchTerm,
        category_filter: null,
        limit_count: 15
      });

      if (error) {
        console.error('Food search error:', error);
        return [];
      }

      return data || [];
    },
    enabled: searchTerm.length >= 2,
  });

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-800">Food Database Search</h3>
        </div>
        
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for foods (e.g., chicken breast, pasta, apple)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4"
          />
        </div>

        {isLoading && searchTerm.length >= 2 && (
          <div className="text-center py-4">
            <div className="w-6 h-6 animate-spin border-2 border-fitness-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Searching database...</p>
          </div>
        )}

        {foodItems && foodItems.length > 0 && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <p className="text-sm text-gray-600">
              Found {foodItems.length} items from centralized food database
            </p>
            {foodItems.map((food) => (
              <div
                key={food.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900 capitalize">{food.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {Math.round((food.similarity_score || 0) * 100)}% match
                    </Badge>
                    {food.verified && (
                      <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                        Verified
                      </Badge>
                    )}
                    {food.cuisine_type && food.cuisine_type !== 'general' && (
                      <Badge variant="secondary" className="text-xs capitalize">
                        {food.cuisine_type}
                      </Badge>
                    )}
                  </div>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>{Math.round(food.calories_per_100g)} cal/100g</span>
                    <span>{Math.round(food.protein_per_100g * 10) / 10}g protein</span>
                    <span>{Math.round(food.carbs_per_100g * 10) / 10}g carbs</span>
                    <span>{Math.round(food.fat_per_100g * 10) / 10}g fat</span>
                  </div>
                  {food.serving_description && (
                    <p className="text-xs text-gray-500 mt-1">
                      Serving: {food.serving_description}
                    </p>
                  )}
                </div>
                {onAddFood && (
                  <Button
                    size="sm"
                    onClick={() => onAddFood(food)}
                    className="ml-3"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {searchTerm.length >= 2 && foodItems && foodItems.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No foods found for "{searchTerm}"</p>
            <p className="text-sm">Try uploading a photo for AI analysis first!</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FoodDatabaseSearch;

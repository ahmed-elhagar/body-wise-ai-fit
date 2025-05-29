
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Heart, Star, Loader2, Utensils } from "lucide-react";
import { useFoodDatabase } from "@/hooks/useFoodDatabase";

interface EnhancedFoodSearchProps {
  onSelectFood?: (food: any) => void;
  showFavoritesOnly?: boolean;
}

const EnhancedFoodSearch = ({ onSelectFood, showFavoritesOnly = false }: EnhancedFoodSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { searchFoodItems, favoriteFoods, isLoadingFavorites, addToFavorites, isAddingToFavorites } = useFoodDatabase();
  
  const { data: searchResults, isLoading: isSearching } = searchFoodItems(
    searchTerm, 
    selectedCategory === "all" ? undefined : selectedCategory
  );

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'protein', label: 'Protein' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'nuts', label: 'Nuts & Seeds' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'general', label: 'General' }
  ];

  const displayItems = showFavoritesOnly ? favoriteFoods : searchResults;
  const isLoading = showFavoritesOnly ? isLoadingFavorites : isSearching;

  const handleAddToFavorites = (foodItem: any) => {
    addToFavorites({
      foodItemId: foodItem.id,
      customName: foodItem.name
    });
  };

  const isFavorite = (foodItemId: string) => {
    return favoriteFoods?.some(fav => fav.food_item?.id === foodItemId);
  };

  return (
    <Card className="p-4 bg-white shadow-sm border border-gray-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              {showFavoritesOnly ? 'My Favorites' : 'Food Search'}
            </h3>
            <p className="text-xs text-gray-600">
              {showFavoritesOnly ? 'Your saved foods' : 'Search nutrition database'}
            </p>
          </div>
        </div>

        {/* Search Controls */}
        {!showFavoritesOnly && (
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Search foods (e.g., chicken breast, apple...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm"
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-600">
              {showFavoritesOnly ? 'Loading favorites...' : 'Searching database...'}
            </p>
          </div>
        )}

        {/* Results */}
        {displayItems && displayItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600">
                {showFavoritesOnly ? 
                  `${displayItems.length} favorite foods` :
                  `Found ${displayItems.length} items`
                }
              </p>
              {!showFavoritesOnly && searchTerm.length >= 2 && (
                <Badge variant="outline" className="text-xs">
                  Live search
                </Badge>
              )}
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {displayItems.map((item: any) => {
                const foodItem = showFavoritesOnly ? item.food_item : item;
                if (!foodItem) return null;

                return (
                  <div
                    key={showFavoritesOnly ? item.id : foodItem.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {showFavoritesOnly && item.custom_name ? item.custom_name : foodItem.name}
                        </h4>
                        
                        {/* Badges */}
                        <div className="flex gap-1 flex-shrink-0">
                          {foodItem.verified && (
                            <Badge variant="default" className="text-xs bg-green-100 text-green-700 border-green-300">
                              <Star className="w-2 h-2 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs capitalize">
                            {foodItem.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Nutrition info */}
                      <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 mb-1">
                        <span>{foodItem.calories_per_100g} cal/100g</span>
                        <span>{foodItem.protein_per_100g}g protein</span>
                        <span>{foodItem.carbs_per_100g}g carbs</span>
                        <span>{foodItem.fat_per_100g}g fat</span>
                      </div>

                      {/* Serving info */}
                      {foodItem.serving_description && (
                        <p className="text-xs text-gray-500 truncate">
                          {foodItem.serving_description}
                        </p>
                      )}

                      {/* Custom notes for favorites */}
                      {showFavoritesOnly && item.notes && (
                        <p className="text-xs text-blue-600 mt-1 truncate">
                          Note: {item.notes}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      {!showFavoritesOnly && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddToFavorites(foodItem)}
                          disabled={isAddingToFavorites || isFavorite(foodItem.id)}
                          className="text-xs px-2 py-1 h-auto"
                        >
                          <Heart className={`w-3 h-3 mr-1 ${isFavorite(foodItem.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          {isFavorite(foodItem.id) ? 'Saved' : 'Save'}
                        </Button>
                      )}
                      
                      {onSelectFood && (
                        <Button
                          size="sm"
                          onClick={() => onSelectFood(foodItem)}
                          className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 h-auto"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty States */}
        {!isLoading && (!displayItems || displayItems.length === 0) && (
          <div className="text-center py-6">
            <Utensils className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            {showFavoritesOnly ? (
              <div>
                <p className="text-sm text-gray-600 mb-2">No favorite foods yet</p>
                <p className="text-xs text-gray-500">
                  Search for foods and save them to your favorites
                </p>
              </div>
            ) : searchTerm.length >= 2 ? (
              <div>
                <p className="text-sm text-gray-600 mb-2">No foods found for "{searchTerm}"</p>
                <p className="text-xs text-gray-500">
                  Try different keywords or use AI photo analysis
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-2">Start typing to search</p>
                <p className="text-xs text-gray-500">
                  Search thousands of foods with nutrition data
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default EnhancedFoodSearch;

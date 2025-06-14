
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Star, Database, Loader2 } from "lucide-react";
import { useFoodDatabase } from "@/hooks/useFoodDatabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface EnhancedSearchTabProps {
  onFoodAdded: () => void;
  onClose: () => void;
}

const EnhancedSearchTab = ({ onFoodAdded, onClose }: EnhancedSearchTabProps) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [quantity, setQuantity] = useState('100');
  
  const { 
    searchFoodItems,
    logConsumption,
    isLoggingConsumption,
    favoriteFoods,
    addToFavorites,
    isAddingToFavorites
  } = useFoodDatabase();
  
  const { data: searchResults, isLoading: isSearching } = searchFoodItems(searchTerm);

  const handleAddFood = async (food: any) => {
    const quantityNum = parseFloat(quantity) || 100;
    const multiplier = quantityNum / 100;
    
    try {
      await logConsumption({
        foodItemId: food.id,
        quantity: quantityNum,
        mealType: 'snack',
        notes: `Added from search: ${food.name}`,
        calories: (food.calories_per_100g || 0) * multiplier,
        protein: (food.protein_per_100g || 0) * multiplier,
        carbs: (food.carbs_per_100g || 0) * multiplier,
        fat: (food.fat_per_100g || 0) * multiplier,
        source: 'manual'
      });
      
      toast.success(`${food.name} added to food log!`);
      onFoodAdded();
      onClose();
    } catch (error) {
      console.error('Failed to add food:', error);
      toast.error('Failed to add food to log');
    }
  };

  const handleAddToFavorites = async (food: any) => {
    try {
      await addToFavorites({
        foodItemId: food.id,
        customName: food.name
      });
    } catch (error) {
      console.error('Failed to add to favorites:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            {t('Search Food Database')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={t('Search for foods (e.g., chicken breast, pasta, apple)...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {searchTerm.length > 0 && searchTerm.length < 2 && (
            <p className="text-sm text-gray-500 text-center">
              {t('Type at least 2 characters to search')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Favorites Section */}
      {favoriteFoods.length > 0 && (
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              {t('Your Favorites')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {favoriteFoods.slice(0, 3).map((favorite) => (
                <div key={favorite.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium">{favorite.custom_name || favorite.food_item?.name}</p>
                    <p className="text-sm text-gray-600">
                      {favorite.food_item?.calories_per_100g || 0} cal/100g
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddFood(favorite.food_item)}
                    disabled={isLoggingConsumption}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {isSearching && searchTerm.length >= 2 && (
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">{t('Searching food database...')}</p>
          </CardContent>
        </Card>
      )}

      {searchResults && searchResults.length > 0 && (
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              {t('Search Results')} ({searchResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {searchResults.map((food) => (
                <div
                  key={food.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 capitalize">{food.name}</h4>
                      {food.verified && (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                          {t('Verified')}
                        </Badge>
                      )}
                      {food.brand && (
                        <Badge variant="secondary" className="text-xs">
                          {food.brand}
                        </Badge>
                      )}
                      {food.similarity_score && (
                        <Badge variant="outline" className="text-xs">
                          {Math.round(food.similarity_score * 100)}% match
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex space-x-4 text-sm text-gray-600 mb-2">
                      <span>{Math.round(food.calories_per_100g)} cal/100g</span>
                      <span>{Math.round(food.protein_per_100g * 10) / 10}g protein</span>
                      <span>{Math.round(food.carbs_per_100g * 10) / 10}g carbs</span>
                      <span>{Math.round(food.fat_per_100g * 10) / 10}g fat</span>
                    </div>
                    
                    {food.serving_description && (
                      <p className="text-xs text-gray-500">
                        {t('Serving')}: {food.serving_description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToFavorites(food)}
                      disabled={isAddingToFavorites}
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => handleAddFood(food)}
                      disabled={isLoggingConsumption}
                      className="bg-fitness-gradient hover:opacity-90"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {t('Add')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {searchTerm.length >= 2 && searchResults && searchResults.length === 0 && !isSearching && (
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t('No foods found')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('No foods found for')} "{searchTerm}". {t('Try different keywords or use AI photo analysis!')}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quantity Input */}
      {selectedFood && (
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{t('Add')} {selectedFood.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Quantity (grams)')}
              </label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="100"
                min="1"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => handleAddFood(selectedFood)}
                disabled={isLoggingConsumption}
                className="bg-fitness-gradient hover:opacity-90 flex-1"
              >
                {isLoggingConsumption ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('Adding...')}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('Add to Log')}
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setSelectedFood(null)}
              >
                {t('Cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedSearchTab;

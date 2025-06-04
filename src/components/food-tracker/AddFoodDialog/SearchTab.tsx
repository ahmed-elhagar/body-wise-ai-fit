
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Clock, Utensils, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFoodDatabase } from "@/hooks/useFoodDatabase";
import { useFoodConsumption } from "@/hooks/useFoodConsumption";
import QuantitySelector from "./components/QuantitySelector";
import { toast } from "sonner";
import { format } from "date-fns";

interface SearchTabProps {
  onFoodAdded: () => void;
  onClose: () => void;
}

const SearchTab = ({ onFoodAdded, onClose }: SearchTabProps) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [quantity, setQuantity] = useState(100);
  const [mealType, setMealType] = useState("snack");
  const [notes, setNotes] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { searchFoodItems, logConsumption, isLoggingConsumption } = useFoodDatabase();
  const { todayConsumption, forceRefresh, isLoading: isLoadingConsumption } = useFoodConsumption();
  
  // Execute search query when searchTerm changes
  const searchQuery = searchFoodItems(searchTerm);
  const { data: searchResults, isLoading: isSearchLoading } = searchQuery;

  // Refresh today's consumption when component mounts
  useEffect(() => {
    console.log('🔄 SearchTab mounted, refreshing today consumption...');
    forceRefresh();
  }, [forceRefresh]);

  // Debug today's consumption data
  useEffect(() => {
    console.log('🍎 Today consumption in SearchTab:', {
      count: todayConsumption?.length || 0,
      isLoading: isLoadingConsumption,
      data: todayConsumption?.slice(0, 3) // Log first 3 for debugging
    });
  }, [todayConsumption, isLoadingConsumption]);

  // Get unique food items from today's consumption for quick add
  const todaysFoodItems = todayConsumption?.reduce((unique: any[], log) => {
    if (!log.food_item) {
      console.log('⚠️ Food log missing food_item:', log);
      return unique;
    }

    const existing = unique.find(item => item.id === log.food_item?.id);
    if (!existing) {
      // Calculate per-100g values from the consumption data
      const per100gCalories = log.quantity_g > 0 ? (log.calories_consumed * 100) / log.quantity_g : 0;
      const per100gProtein = log.quantity_g > 0 ? (log.protein_consumed * 100) / log.quantity_g : 0;
      const per100gCarbs = log.quantity_g > 0 ? (log.carbs_consumed * 100) / log.quantity_g : 0;
      const per100gFat = log.quantity_g > 0 ? (log.fat_consumed * 100) / log.quantity_g : 0;
      
      unique.push({
        id: log.food_item.id,
        name: log.food_item.name,
        brand: log.food_item.brand,
        category: log.food_item.category || 'general',
        calories_per_100g: Math.round(per100gCalories),
        protein_per_100g: Math.round(per100gProtein * 10) / 10, // 1 decimal place
        carbs_per_100g: Math.round(per100gCarbs * 10) / 10,
        fat_per_100g: Math.round(per100gFat * 10) / 10,
        verified: true,
        lastConsumed: log.consumed_at,
        originalQuantity: log.quantity_g,
        originalMealType: log.meal_type
      });
    }
    return unique;
  }, []) || [];

  console.log('🔍 SearchTab Debug:', {
    searchTerm,
    searchResultsCount: searchResults?.length || 0,
    isSearchLoading,
    todaysFoodItemsCount: todaysFoodItems.length,
    todayConsumptionCount: todayConsumption?.length || 0,
    isLoadingConsumption,
    todaysFoodItems: todaysFoodItems.slice(0, 2) // Log first 2 items
  });

  const handleSelectFood = (food: any) => {
    console.log('🎯 Selected food:', food);
    setSelectedFood(food);
    
    // If it's from today's foods, pre-fill with original quantity and meal type
    if (food.originalQuantity) {
      setQuantity(food.originalQuantity);
      setMealType(food.originalMealType || 'snack');
    } else {
      // Reset to defaults for search results
      setQuantity(100);
      setMealType('snack');
    }
  };

  const handleAddFood = async () => {
    if (!selectedFood) return;

    const multiplier = quantity / 100;
    const calories = (selectedFood.calories_per_100g || 0) * multiplier;
    const protein = (selectedFood.protein_per_100g || 0) * multiplier;
    const carbs = (selectedFood.carbs_per_100g || 0) * multiplier;
    const fat = (selectedFood.fat_per_100g || 0) * multiplier;

    try {
      console.log('📝 Adding food to log:', {
        foodItemId: selectedFood.id,
        quantity,
        mealType,
        notes,
        calories,
        protein,
        carbs,
        fat
      });

      await logConsumption({
        foodItemId: selectedFood.id,
        quantity,
        mealType,
        notes,
        calories,
        protein,
        carbs,
        fat,
        source: 'search'
      });
      
      console.log('✅ Food logged successfully, resetting form...');
      
      // Reset form
      setSelectedFood(null);
      setQuantity(100);
      setMealType("snack");
      setNotes("");
      
      // Call parent handlers
      onFoodAdded();
    } catch (error) {
      console.error('❌ Error logging food:', error);
      toast.error(t('Failed to log food'));
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      console.log('🔄 Manual refresh triggered...');
      await forceRefresh();
      toast.success(t('Data refreshed'));
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
      toast.error(t('Failed to refresh data'));
    } finally {
      setIsRefreshing(false);
    }
  };

  const FoodCard = ({ food, isQuickAdd = false }: { food: any; isQuickAdd?: boolean }) => (
    <Card 
      key={`${isQuickAdd ? 'today' : 'search'}-${food.id}`}
      className={`p-3 cursor-pointer transition-all hover:shadow-md border ${
        selectedFood?.id === food.id 
          ? 'ring-2 ring-green-600 bg-green-50 border-green-200' 
          : 'hover:border-green-200'
      }`}
      onClick={() => handleSelectFood(food)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900">{food.name}</h4>
            {isQuickAdd && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                <Clock className="w-3 h-3 mr-1" />
                {t('Recent')}
              </Badge>
            )}
          </div>
          {food.brand && (
            <p className="text-sm text-gray-500">{food.brand}</p>
          )}
          {isQuickAdd && food.lastConsumed && (
            <p className="text-xs text-gray-400 mt-1">
              {t('Last eaten')}: {format(new Date(food.lastConsumed), 'MMM d, HH:mm')}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {food.category}
            </Badge>
            {food.verified && (
              <Badge variant="default" className="text-xs bg-green-600">
                {t('Verified')}
              </Badge>
            )}
          </div>
        </div>
        <div className="text-right text-sm text-gray-600">
          <div className="font-medium">{Math.round(food.calories_per_100g || 0)} cal</div>
          <div className="text-xs">per 100g</div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{t('Search & Add Food')}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshData}
          disabled={isRefreshing || isLoadingConsumption}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {t('Refresh')}
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder={t('Search for food items...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        {isSearchLoading && (
          <div className="absolute right-3 top-3">
            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Today's Foods - Quick Add Section */}
      {!searchTerm && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-blue-600" />
            <h3 className="font-medium text-gray-900">{t('Today\'s Foods - Quick Add')}</h3>
            {isLoadingConsumption ? (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Badge variant="outline" className="text-xs">
                {todaysFoodItems.length} items
              </Badge>
            )}
          </div>
          
          {isLoadingConsumption ? (
            <div className="flex items-center justify-center h-20">
              <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : todaysFoodItems.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {todaysFoodItems.slice(0, 5).map((food) => (
                <FoodCard key={`today-${food.id}`} food={food} isQuickAdd={true} />
              ))}
              {todaysFoodItems.length > 5 && (
                <p className="text-xs text-gray-500 text-center py-2">
                  {t('Showing first 5 items')} ({todaysFoodItems.length} total)
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <Utensils className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">{t('No foods logged today yet')}</p>
              <p className="text-xs text-gray-400 mt-1">{t('Add some food to see quick options here')}</p>
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {searchTerm.length >= 2 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            {t('Search Results')}
            {isSearchLoading && (
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            )}
          </h3>
          
          {searchResults && searchResults.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map((food: any) => (
                <FoodCard key={`search-${food.id}`} food={food} />
              ))}
            </div>
          ) : !isSearchLoading ? (
            <div className="text-center py-8">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">{t('No food items found')}</p>
              <p className="text-sm text-gray-400 mt-1">{t('Try different keywords')}</p>
            </div>
          ) : null}
        </div>
      )}

      {/* Default state when no search and no today's foods */}
      {!searchTerm && todaysFoodItems.length === 0 && !isLoadingConsumption && (
        <div className="text-center py-8">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t('Search for food items to add to your log')}</p>
          <p className="text-sm text-gray-400 mt-1">{t('Start typing to see results')}</p>
          <p className="text-xs text-gray-400 mt-2">{t('Once you log some food today, they\'ll appear here for quick re-adding')}</p>
        </div>
      )}

      {/* Selected Food Details */}
      {selectedFood && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium text-gray-900">{t('Add to Log')}</h3>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800">{selectedFood.name}</h4>
            {selectedFood.brand && (
              <p className="text-sm text-green-600">{selectedFood.brand}</p>
            )}
            
            <div className="grid grid-cols-4 gap-2 mt-3 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round((selectedFood.calories_per_100g || 0) * (quantity / 100))}
                </div>
                <div className="text-green-600">cal</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round((selectedFood.protein_per_100g || 0) * (quantity / 100) * 10) / 10}g
                </div>
                <div className="text-green-600">protein</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round((selectedFood.carbs_per_100g || 0) * (quantity / 100) * 10) / 10}g
                </div>
                <div className="text-green-600">carbs</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round((selectedFood.fat_per_100g || 0) * (quantity / 100) * 10) / 10}g
                </div>
                <div className="text-green-600">fat</div>
              </div>
            </div>
          </div>

          <QuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
            mealType={mealType}
            onMealTypeChange={setMealType}
            notes={notes}
            onNotesChange={setNotes}
          />

          <Button
            onClick={handleAddFood}
            disabled={isLoggingConsumption}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isLoggingConsumption ? t('Adding...') : t('Add to Log')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchTab;


import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFoodDatabase } from "@/hooks/useFoodDatabase";
import QuantitySelector from "./components/QuantitySelector";
import { toast } from "sonner";

interface SearchTabProps {
  onFoodAdded: () => void;
  onClose: () => void;
}

const SearchTab = ({ onFoodAdded, onClose }: SearchTabProps) => {
  const { t, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [quantity, setQuantity] = useState(100);
  const [mealType, setMealType] = useState("snack");
  const [notes, setNotes] = useState("");

  const { searchFoodItems, logConsumption, isLoggingConsumption } = useFoodDatabase();
  const { data: searchResults, isLoading } = searchFoodItems(searchTerm);

  const handleSelectFood = (food: any) => {
    setSelectedFood(food);
  };

  const handleAddFood = async () => {
    if (!selectedFood) return;

    const multiplier = quantity / 100; // Convert to per 100g basis
    const calories = (selectedFood.calories_per_100g || 0) * multiplier;
    const protein = (selectedFood.protein_per_100g || 0) * multiplier;
    const carbs = (selectedFood.carbs_per_100g || 0) * multiplier;
    const fat = (selectedFood.fat_per_100g || 0) * multiplier;

    try {
      logConsumption({
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
      
      onFoodAdded();
      onClose();
    } catch (error) {
      console.error('Error logging food:', error);
      toast.error('Failed to log food');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder={t('Search for food items...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Search Results */}
      {searchTerm.length >= 2 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">{t('Search Results')}</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map((food: any) => (
                <Card 
                  key={food.id} 
                  className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                    selectedFood?.id === food.id ? 'ring-2 ring-green-600 bg-green-50' : ''
                  }`}
                  onClick={() => handleSelectFood(food)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{food.name}</h4>
                      {food.brand && (
                        <p className="text-sm text-gray-500">{food.brand}</p>
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
                      <div>{Math.round(food.calories_per_100g || 0)} cal</div>
                      <div className="text-xs">per 100g</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              {t('No food items found')}
            </p>
          )}
        </div>
      )}

      {/* Selected Food Details */}
      {selectedFood && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium text-gray-900">{t('Add to Log')}</h3>
          
          <div className="bg-green-50 p-4 rounded-lg">
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
                  {Math.round((selectedFood.protein_per_100g || 0) * (quantity / 100))}g
                </div>
                <div className="text-green-600">protein</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round((selectedFood.carbs_per_100g || 0) * (quantity / 100))}g
                </div>
                <div className="text-green-600">carbs</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round((selectedFood.fat_per_100g || 0) * (quantity / 100))}g
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

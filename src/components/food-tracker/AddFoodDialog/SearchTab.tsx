import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface SearchTabProps {
  onAddFood: (food: any) => void;
  onFoodAdded?: () => void;
  onClose?: () => void;
}

const SAMPLE_FOODS = [
  { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Brown Rice (1 cup)', calories: 216, protein: 5, carbs: 45, fat: 1.8 },
  { name: 'Broccoli (1 cup)', calories: 25, protein: 3, carbs: 5, fat: 0.3 }
];

export const SearchTab = ({ onAddFood, onFoodAdded, onClose }: SearchTabProps) => {
  const { t, isRTL } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(SAMPLE_FOODS);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate search
    setTimeout(() => {
      const filtered = SAMPLE_FOODS.filter(food => 
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 1000);
  };

  const handleAddFood = (food: any) => {
    onAddFood(food);
    onFoodAdded?.();
    onClose?.();
  };

  return (
    <div className={`space-y-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('foodTracker:searchFoods') || 'Search for foods...'}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {searchResults.map((food, index) => (
          <div key={index} className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h4 className="font-medium text-gray-900">{food.name}</h4>
              <div className={`flex gap-3 text-xs text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>{food.calories} cal</span>
                <span>{food.protein}g protein</span>
                <span>{food.carbs}g carbs</span>
                <span>{food.fat}g fat</span>
              </div>
            </div>
            <Button size="sm" onClick={() => handleAddFood(food)}>
              {t('foodTracker:add') || 'Add'}
            </Button>
          </div>
        ))}
        
        {searchResults.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {t('foodTracker:noResults') || 'No foods found. Try a different search term.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTab;

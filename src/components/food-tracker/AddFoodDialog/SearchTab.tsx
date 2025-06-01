import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { searchFood } from '@/integrations/edamam';
import FoodItem from './components/FoodItem';

interface SearchTabProps {
  onFoodAdded: () => void;
  onClose: () => void;
}

const SearchTab = ({ onFoodAdded, onClose }: SearchTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { t } = useI18n();

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedSearchTerm) {
        setIsLoading(true);
        try {
          const results = await searchFood(debouncedSearchTerm);
          setSearchResults(results);
        } catch (error) {
          toast.error(t('searchTab.errorSearching') || 'Error searching for food');
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchData();
  }, [debouncedSearchTerm, t]);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder={t('searchTab.searchPlaceholder') || "Search for food"}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('searchTab.searching') || "Searching..."}
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              {t('searchTab.search') || "Search"}
            </>
          )}
        </Button>
      </div>

      {isLoading && (
        <div className="text-center">
          <Loader2 className="mr-2 h-6 w-6 animate-spin inline-block" />
          {t('searchTab.loadingResults') || "Loading results..."}
        </div>
      )}

      {searchResults.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <ul className="space-y-2">
              {searchResults.map((food) => (
                <FoodItem 
                  key={food.food.foodId} 
                  food={food.food} 
                  onFoodAdded={() => {
                    onFoodAdded();
                    onClose();
                  }} 
                />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {searchTerm && searchResults.length === 0 && !isLoading && (
        <div className="text-center text-gray-500">
          {t('searchTab.noResults') || "No results found."}
        </div>
      )}
    </div>
  );
};

export default SearchTab;

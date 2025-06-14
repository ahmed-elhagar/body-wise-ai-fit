
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface SearchTabProps {
  onFoodSelect: (food: any) => void;
}

const SearchTab = ({ onFoodSelect }: SearchTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { tFrom } = useI18n();
  const tFoodTracker = tFrom('foodTracker');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Placeholder search logic - would integrate with food database API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSearchResults([]);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder={String(tFoodTracker('searchPlaceholder'))}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>

      {searchResults.length === 0 && !isSearching && (
        <div className="text-center py-8 text-gray-500">
          {String(tFoodTracker('searchToBegin'))}
        </div>
      )}
    </div>
  );
};

export default SearchTab;

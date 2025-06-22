
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isActive: boolean;
  onToggleSearch: () => void;
  searchStats: {
    totalResults: number;
    totalMessages: number;
    hasResults: boolean;
    isFiltered: boolean;
  };
  onClearSearch: () => void;
}

const ChatSearchBar = ({
  searchQuery,
  onSearchChange,
  isActive,
  onToggleSearch,
  searchStats,
  onClearSearch
}: ChatSearchBarProps) => {
  return (
    <div className={cn(
      "border-b border-gray-200 bg-white transition-all duration-200",
      isActive ? "p-3" : "p-2"
    )}>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSearch}
          className={cn(
            "p-2 transition-colors",
            isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
          )}
        >
          <Search className="h-4 w-4" />
        </Button>
        
        {isActive && (
          <>
            <div className="flex-1 relative">
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pr-8 text-sm"
                autoFocus
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearSearch}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 h-6 w-6"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {searchStats.isFiltered && (
              <Badge variant="secondary" className="text-xs">
                {searchStats.totalResults} of {searchStats.totalMessages}
              </Badge>
            )}
          </>
        )}
      </div>
      
      {isActive && searchStats.isFiltered && !searchStats.hasResults && (
        <div className="mt-2 text-center py-2">
          <p className="text-sm text-gray-500">No messages found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default ChatSearchBar;

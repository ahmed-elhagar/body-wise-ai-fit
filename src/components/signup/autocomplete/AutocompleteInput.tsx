
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface AutocompleteInputProps {
  label: string;
  placeholder: string;
  suggestions: string[];
  selectedItems: string[];
  onSelectionChange: (items: string[]) => void;
  maxSelections?: number;
}

const AutocompleteInput = ({
  label,
  placeholder,
  suggestions,
  selectedItems,
  onSelectionChange,
  maxSelections = 10
}: AutocompleteInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestions.filter(
        item => 
          item.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedItems.includes(item)
      );
      setFilteredSuggestions(filtered.slice(0, 8));
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setIsOpen(false);
    }
  }, [inputValue, suggestions, selectedItems]);

  const handleSelectItem = (item: string) => {
    if (!selectedItems.includes(item) && selectedItems.length < maxSelections) {
      onSelectionChange([...selectedItems, item]);
    }
    setInputValue("");
    setIsOpen(false);
  };

  const handleRemoveItem = (item: string) => {
    onSelectionChange(selectedItems.filter(selected => selected !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const customItem = inputValue.trim();
      if (!selectedItems.includes(customItem) && selectedItems.length < maxSelections) {
        onSelectionChange([...selectedItems, customItem]);
      }
      setInputValue("");
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      
      {/* Selected items */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedItems.map((item) => (
            <Badge key={item} variant="secondary" className="flex items-center gap-1">
              {item}
              <button
                type="button"
                onClick={() => handleRemoveItem(item)}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input field */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedItems.length >= maxSelections ? "Maximum reached" : placeholder}
          disabled={selectedItems.length >= maxSelections}
          className="w-full"
        />

        {/* Dropdown */}
        {isOpen && filteredSuggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 text-sm"
                onClick={() => handleSelectItem(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Type to search or add custom items. Press Enter to add. ({selectedItems.length}/{maxSelections})
      </p>
    </div>
  );
};

export default AutocompleteInput;

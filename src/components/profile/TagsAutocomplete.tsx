
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagsAutocompleteProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  className?: string;
}

const TagsAutocomplete = ({ 
  selectedTags, 
  onTagsChange, 
  suggestions = [], 
  placeholder = "Add tags...",
  className 
}: TagsAutocompleteProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!selectedTags.includes(inputValue.trim())) {
        onTagsChange([...selectedTags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className={className}>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="mb-2"
      />
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <X 
              className="w-3 h-3 cursor-pointer" 
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagsAutocomplete;

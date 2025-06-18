
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagsAutocompleteProps {
  label: string;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder: string;
  suggestions?: string[];
}

const TagsAutocomplete = ({
  label,
  selectedTags,
  onTagsChange,
  placeholder,
  suggestions = [],
}: TagsAutocompleteProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!selectedTags.includes(inputValue.trim())) {
        onTagsChange([...selectedTags, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
      />
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-1 hover:bg-gray-300 rounded-full"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagsAutocomplete;

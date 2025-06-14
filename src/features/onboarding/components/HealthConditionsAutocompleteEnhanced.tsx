
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface HealthConditionsAutocompleteEnhancedProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const HealthConditionsAutocompleteEnhanced = ({ 
  value, 
  onChange 
}: HealthConditionsAutocompleteEnhancedProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddCondition = (condition: string) => {
    if (condition.trim() && !value.includes(condition.trim())) {
      onChange([...value, condition.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveCondition = (conditionToRemove: string) => {
    onChange(value.filter(condition => condition !== conditionToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleAddCondition(inputValue);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        Health Conditions (Optional)
      </Label>
      
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type condition and press Enter"
        className="border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
      />
      
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((condition, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {condition}
              <button
                onClick={() => handleRemoveCondition(condition)}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthConditionsAutocompleteEnhanced;

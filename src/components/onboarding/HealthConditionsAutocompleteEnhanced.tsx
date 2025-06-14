
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface HealthConditionsAutocompleteEnhancedProps {
  selectedConditions: string[];
  onConditionsChange: (conditions: string[]) => void;
  label: string;
  placeholder: string;
}

const HealthConditionsAutocompleteEnhanced = ({
  selectedConditions,
  onConditionsChange,
  label,
  placeholder
}: HealthConditionsAutocompleteEnhancedProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddCondition = () => {
    if (inputValue.trim() && !selectedConditions.includes(inputValue.trim())) {
      onConditionsChange([...selectedConditions, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveCondition = (condition: string) => {
    onConditionsChange(selectedConditions.filter(c => c !== condition));
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          onKeyPress={(e) => e.key === 'Enter' && handleAddCondition()}
        />
        <Button
          type="button"
          onClick={handleAddCondition}
          disabled={!inputValue.trim()}
          size="sm"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      {selectedConditions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedConditions.map((condition, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {condition}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => handleRemoveCondition(condition)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthConditionsAutocompleteEnhanced;

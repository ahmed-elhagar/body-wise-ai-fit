
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface DietaryRestrictionsSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const DietaryRestrictionsSelector = ({ value, onChange }: DietaryRestrictionsSelectorProps) => {
  const commonRestrictions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Keto',
    'Low-Carb',
    'Low-Fat',
    'Halal',
    'Kosher',
    'Paleo',
    'Mediterranean',
    'Diabetic-Friendly',
    'Low-Sodium',
    'Organic Only'
  ];

  const toggleRestriction = (restriction: string) => {
    if (value.includes(restriction)) {
      onChange(value.filter(r => r !== restriction));
    } else {
      onChange([...value, restriction]);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        Dietary Restrictions & Preferences (Optional)
      </Label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {commonRestrictions.map((restriction) => (
          <Button
            key={restriction}
            type="button"
            variant={value.includes(restriction) ? "default" : "outline"}
            className={`h-auto p-3 text-sm ${
              value.includes(restriction) ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => toggleRestriction(restriction)}
          >
            {restriction}
          </Button>
        ))}
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">Selected:</Label>
          <div className="flex flex-wrap gap-2">
            {value.map((restriction) => (
              <Badge key={restriction} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                {restriction}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => toggleRestriction(restriction)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DietaryRestrictionsSelector;


import React from 'react';
import { Label } from "@/components/ui/label";

const CUISINES = [
  'Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'Thai', 'French',
  'Mediterranean', 'Middle Eastern', 'American', 'Korean', 'Vietnamese',
  'Greek', 'Spanish', 'Turkish', 'Lebanese', 'Moroccan', 'Ethiopian'
];

interface CuisineSelectorProps {
  selectedCuisines: string[];
  onToggleCuisine: (cuisine: string) => void;
}

export const CuisineSelector: React.FC<CuisineSelectorProps> = ({
  selectedCuisines,
  onToggleCuisine
}) => {
  return (
    <div className="space-y-3">
      <Label>Preferred Cuisines</Label>
      <div className="grid grid-cols-3 gap-2">
        {CUISINES.map(cuisine => (
          <div
            key={cuisine}
            onClick={() => onToggleCuisine(cuisine)}
            className={`p-2 border rounded-lg cursor-pointer text-center text-sm transition-colors ${
              selectedCuisines.includes(cuisine)
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'hover:bg-gray-50'
            }`}
          >
            {cuisine}
          </div>
        ))}
      </div>
    </div>
  );
};

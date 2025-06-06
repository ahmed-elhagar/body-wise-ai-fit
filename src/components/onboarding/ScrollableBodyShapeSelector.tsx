
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface ScrollableBodyShapeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  bodyFatValue: number;
  onBodyFatChange: (value: number) => void;
  gender: string;
}

const ScrollableBodyShapeSelector = ({ 
  value, 
  onChange, 
  bodyFatValue, 
  onBodyFatChange, 
  gender 
}: ScrollableBodyShapeSelectorProps) => {
  const bodyShapes = [
    { id: 'lean', label: 'Lean', description: 'Low body fat, defined muscles' },
    { id: 'athletic', label: 'Athletic', description: 'Moderate muscle definition' },
    { id: 'average', label: 'Average', description: 'Normal body composition' },
    { id: 'curvy', label: 'Curvy', description: 'Fuller figure with curves' },
    { id: 'heavy', label: 'Heavy', description: 'Higher body fat percentage' },
  ];

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        Body Shape (Optional)
      </Label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {bodyShapes.map((shape) => (
          <Button
            key={shape.id}
            type="button"
            variant={value === shape.id ? "default" : "outline"}
            className={`h-auto p-4 flex flex-col items-center gap-2 ${
              value === shape.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onChange(shape.id)}
          >
            <User className="w-6 h-6" />
            <div className="text-center">
              <div className="font-medium text-sm">{shape.label}</div>
              <div className="text-xs text-gray-500">{shape.description}</div>
            </div>
          </Button>
        ))}
      </div>

      <div className="mt-4">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Body Fat Percentage: {bodyFatValue}%
        </Label>
        <input
          type="range"
          min={gender === 'male' ? 8 : 15}
          max={gender === 'male' ? 35 : 45}
          value={bodyFatValue}
          onChange={(e) => onBodyFatChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ScrollableBodyShapeSelector;

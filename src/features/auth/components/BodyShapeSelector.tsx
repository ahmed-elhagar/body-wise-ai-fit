
import React from 'react';
import { Card } from "@/components/ui/card";

interface BodyShapeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const BodyShapeSelector = ({ value, onChange }: BodyShapeSelectorProps) => {
  const bodyShapes = [
    { id: 'thin', label: 'Thin', description: 'Naturally lean build' },
    { id: 'average', label: 'Average', description: 'Balanced proportions' },
    { id: 'athletic', label: 'Athletic', description: 'Muscular build' },
    { id: 'curvy', label: 'Curvy', description: 'Fuller figure' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {bodyShapes.map((shape) => (
        <Card
          key={shape.id}
          className={`p-4 cursor-pointer transition-all ${
            value === shape.id
              ? 'ring-2 ring-blue-500 bg-blue-50'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onChange(shape.id)}
        >
          <div className="text-center">
            <h3 className="font-medium">{shape.label}</h3>
            <p className="text-sm text-gray-600 mt-1">{shape.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BodyShapeSelector;

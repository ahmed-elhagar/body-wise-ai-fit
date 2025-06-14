
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface BodyShapeSelectorProps {
  selectedShape: string;
  onShapeSelect: (shape: string) => void;
  className?: string;
}

const bodyShapes = [
  { id: 'ectomorph', name: 'Ectomorph', description: 'Lean and long, difficulty building muscle' },
  { id: 'mesomorph', name: 'Mesomorph', description: 'Muscular and well-built, gains muscle easily' },
  { id: 'endomorph', name: 'Endomorph', description: 'Bigger, high body fat, gains weight easily' }
];

const BodyShapeSelector = ({ selectedShape, onShapeSelect, className }: BodyShapeSelectorProps) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-base font-medium">Select your body type:</Label>
      <div className="grid gap-3">
        {bodyShapes.map((shape) => (
          <Card 
            key={shape.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedShape === shape.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onShapeSelect(shape.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1 ${
                  selectedShape === shape.id 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedShape === shape.id && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{shape.name}</h3>
                  <p className="text-sm text-gray-600">{shape.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BodyShapeSelector;

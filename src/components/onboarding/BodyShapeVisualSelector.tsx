
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import BodyFatSlider from "./BodyFatSlider";

interface BodyShapeVisualSelectorProps {
  value: string;
  onChange: (value: string) => void;
  gender: string;
}

const BodyShapeVisualSelector = ({ value, onChange, gender }: BodyShapeVisualSelectorProps) => {
  const [bodyFatPercentage, setBodyFatPercentage] = useState(25);

  const bodyShapes = [
    {
      id: 'slender',
      name: 'Slender',
      description: 'Naturally thin build',
      maleIcon: '🕺',
      femaleIcon: '💃',
    },
    {
      id: 'average',
      name: 'Average',
      description: 'Medium build',
      maleIcon: '🚶‍♂️',
      femaleIcon: '🚶‍♀️',
    },
    {
      id: 'heavy',
      name: 'Heavy',
      description: 'Larger build',
      maleIcon: '🤵',
      femaleIcon: '👸',
    }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="text-base font-semibold">
          Choose your current body shape
        </Label>
        <div className="grid grid-cols-1 gap-4">
          {bodyShapes.map((shape) => {
            const isSelected = value === shape.id;
            return (
              <Card
                key={shape.id}
                className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                  isSelected
                    ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
                onClick={() => onChange(shape.id)}
                data-testid={`body-shape-${shape.id}`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">
                    {gender === 'female' ? shape.femaleIcon : shape.maleIcon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">{shape.name}</h3>
                    <p className="text-sm text-gray-600">{shape.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="border-t pt-8">
        <BodyFatSlider
          value={bodyFatPercentage}
          onChange={setBodyFatPercentage}
          gender={gender}
        />
      </div>
    </div>
  );
};

export default BodyShapeVisualSelector;

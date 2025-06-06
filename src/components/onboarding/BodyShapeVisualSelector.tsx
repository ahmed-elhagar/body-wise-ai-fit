
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
      name: 'Ectomorph',
      description: 'Naturally thin, fast metabolism',
      maleIcon: (
        <svg viewBox="0 0 100 200" className="w-16 h-32 mx-auto">
          {/* Male Ectomorph - Thin build */}
          <ellipse cx="50" cy="25" rx="12" ry="15" fill="currentColor" />
          <rect x="46" y="40" width="8" height="45" rx="4" fill="currentColor" />
          <rect x="42" y="50" width="4" height="25" rx="2" fill="currentColor" />
          <rect x="54" y="50" width="4" height="25" rx="2" fill="currentColor" />
          <rect x="46" y="85" width="8" height="35" rx="4" fill="currentColor" />
          <rect x="44" y="120" width="5" height="50" rx="2.5" fill="currentColor" />
          <rect x="51" y="120" width="5" height="50" rx="2.5" fill="currentColor" />
        </svg>
      ),
      femaleIcon: (
        <svg viewBox="0 0 100 200" className="w-16 h-32 mx-auto">
          {/* Female Ectomorph - Thin build */}
          <ellipse cx="50" cy="25" rx="12" ry="15" fill="currentColor" />
          <rect x="46" y="40" width="8" height="25" rx="4" fill="currentColor" />
          <rect x="44" y="65" width="12" height="30" rx="6" fill="currentColor" />
          <rect x="42" y="50" width="4" height="20" rx="2" fill="currentColor" />
          <rect x="54" y="50" width="4" height="20" rx="2" fill="currentColor" />
          <rect x="45" y="95" width="10" height="25" rx="5" fill="currentColor" />
          <rect x="44" y="120" width="5" height="50" rx="2.5" fill="currentColor" />
          <rect x="51" y="120" width="5" height="50" rx="2.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: 'average',
      name: 'Mesomorph',
      description: 'Athletic build, balanced metabolism',
      maleIcon: (
        <svg viewBox="0 0 100 200" className="w-16 h-32 mx-auto">
          {/* Male Mesomorph - Athletic build */}
          <ellipse cx="50" cy="25" rx="14" ry="16" fill="currentColor" />
          <rect x="42" y="40" width="16" height="50" rx="8" fill="currentColor" />
          <rect x="38" y="50" width="6" height="30" rx="3" fill="currentColor" />
          <rect x="56" y="50" width="6" height="30" rx="3" fill="currentColor" />
          <rect x="44" y="90" width="12" height="30" rx="6" fill="currentColor" />
          <rect x="42" y="120" width="7" height="50" rx="3.5" fill="currentColor" />
          <rect x="51" y="120" width="7" height="50" rx="3.5" fill="currentColor" />
        </svg>
      ),
      femaleIcon: (
        <svg viewBox="0 0 100 200" className="w-16 h-32 mx-auto">
          {/* Female Mesomorph - Athletic build */}
          <ellipse cx="50" cy="25" rx="14" ry="16" fill="currentColor" />
          <rect x="44" y="40" width="12" height="30" rx="6" fill="currentColor" />
          <rect x="40" y="70" width="20" height="35" rx="10" fill="currentColor" />
          <rect x="38" y="50" width="6" height="25" rx="3" fill="currentColor" />
          <rect x="56" y="50" width="6" height="25" rx="3" fill="currentColor" />
          <rect x="43" y="105" width="14" height="15" rx="7" fill="currentColor" />
          <rect x="42" y="120" width="7" height="50" rx="3.5" fill="currentColor" />
          <rect x="51" y="120" width="7" height="50" rx="3.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: 'heavy',
      name: 'Endomorph',
      description: 'Broader build, slower metabolism',
      maleIcon: (
        <svg viewBox="0 0 100 200" className="w-16 h-32 mx-auto">
          {/* Male Endomorph - Broader build */}
          <ellipse cx="50" cy="25" rx="16" ry="17" fill="currentColor" />
          <rect x="38" y="40" width="24" height="55" rx="12" fill="currentColor" />
          <rect x="32" y="55" width="8" height="35" rx="4" fill="currentColor" />
          <rect x="60" y="55" width="8" height="35" rx="4" fill="currentColor" />
          <rect x="40" y="95" width="20" height="25" rx="10" fill="currentColor" />
          <rect x="40" y="120" width="8" height="50" rx="4" fill="currentColor" />
          <rect x="52" y="120" width="8" height="50" rx="4" fill="currentColor" />
        </svg>
      ),
      femaleIcon: (
        <svg viewBox="0 0 100 200" className="w-16 h-32 mx-auto">
          {/* Female Endomorph - Broader build */}
          <ellipse cx="50" cy="25" rx="16" ry="17" fill="currentColor" />
          <rect x="40" y="40" width="20" height="35" rx="10" fill="currentColor" />
          <rect x="35" y="75" width="30" height="40" rx="15" fill="currentColor" />
          <rect x="32" y="55" width="8" height="30" rx="4" fill="currentColor" />
          <rect x="60" y="55" width="8" height="30" rx="4" fill="currentColor" />
          <rect x="38" y="115" width="24" height="5" rx="2.5" fill="currentColor" />
          <rect x="40" y="120" width="8" height="50" rx="4" fill="currentColor" />
          <rect x="52" y="120" width="8" height="50" rx="4" fill="currentColor" />
        </svg>
      ),
    }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="text-base font-semibold">
          Choose your current body type
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
                <div className="flex items-center gap-6">
                  <div className="text-gray-600 flex-shrink-0">
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

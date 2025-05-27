
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface BodyShapeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  gender: string;
}

const BodyShapeSelector = ({ value, onChange, gender }: BodyShapeSelectorProps) => {
  const bodyShapes = [
    {
      id: 'ectomorph',
      name: 'Ectomorph',
      description: 'Naturally thin, fast metabolism',
      maleIcon: '🏃‍♂️',
      femaleIcon: '🏃‍♀️',
      characteristics: ['Lean build', 'Difficulty gaining weight', 'Fast metabolism']
    },
    {
      id: 'mesomorph',
      name: 'Mesomorph',
      description: 'Athletic build, muscular',
      maleIcon: '🏋️‍♂️',
      femaleIcon: '🏋️‍♀️',
      characteristics: ['Athletic build', 'Gains muscle easily', 'Balanced metabolism']
    },
    {
      id: 'endomorph',
      name: 'Endomorph',
      description: 'Naturally curvy, slower metabolism',
      maleIcon: '👨‍💼',
      femaleIcon: '👩‍💼',
      characteristics: ['Rounder physique', 'Gains weight easily', 'Slower metabolism']
    }
  ];

  return (
    <div>
      <Label className="text-base font-semibold mb-4 block">Select Your Body Type</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bodyShapes.map((shape) => (
          <Card
            key={shape.id}
            className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              value === shape.id
                ? 'ring-2 ring-fitness-primary bg-fitness-primary/5'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onChange(shape.id)}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">
                {gender === 'female' ? shape.femaleIcon : shape.maleIcon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{shape.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{shape.description}</p>
              <ul className="text-xs text-gray-500 space-y-1">
                {shape.characteristics.map((char, index) => (
                  <li key={index}>• {char}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BodyShapeSelector;

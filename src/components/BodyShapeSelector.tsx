
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
      id: 'apple',
      name: 'Apple Shape',
      description: 'Weight carried around midsection',
      maleIcon: '🍎',
      femaleIcon: '🍎',
      characteristics: ['Broader shoulders', 'Fuller midsection', 'Slimmer hips'],
      dietFocus: 'Anti-inflammatory foods, reduce processed carbs'
    },
    {
      id: 'pear',
      name: 'Pear Shape',
      description: 'Weight carried in hips and thighs',
      maleIcon: '🍐',
      femaleIcon: '🍐',
      characteristics: ['Narrower shoulders', 'Smaller waist', 'Fuller hips'],
      dietFocus: 'Lean proteins, complex carbs, healthy fats'
    },
    {
      id: 'hourglass',
      name: 'Hourglass Shape',
      description: 'Balanced proportions, defined waist',
      maleIcon: '⏳',
      femaleIcon: '⏳',
      characteristics: ['Balanced shoulders/hips', 'Defined waist', 'Proportionate build'],
      dietFocus: 'Balanced macronutrients, portion control'
    },
    {
      id: 'rectangle',
      name: 'Rectangle Shape',
      description: 'Straight, athletic build',
      maleIcon: '📱',
      femaleIcon: '📱',
      characteristics: ['Similar waist/hip measurements', 'Athletic build', 'Less defined waist'],
      dietFocus: 'Higher protein for muscle definition'
    },
    {
      id: 'inverted_triangle',
      name: 'Inverted Triangle',
      description: 'Broader shoulders, narrower hips',
      maleIcon: '🔺',
      femaleIcon: '🔺',
      characteristics: ['Broad shoulders', 'Narrow waist', 'Slim hips'],
      dietFocus: 'Balanced diet with healthy carbs for lower body'
    }
  ];

  return (
    <div>
      <Label className="text-base font-semibold mb-4 block">Select Your Body Shape</Label>
      <p className="text-sm text-gray-600 mb-6">
        This helps us understand your metabolism and create a personalized diet plan that works best for your body type.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bodyShapes.map((shape) => (
          <Card
            key={shape.id}
            className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              value === shape.id
                ? 'ring-2 ring-fitness-primary bg-fitness-primary/5'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onChange(shape.id)}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">
                {gender === 'female' ? shape.femaleIcon : shape.maleIcon}
              </div>
              <h3 className="font-semibold text-base mb-2">{shape.name}</h3>
              <p className="text-xs text-gray-600 mb-3">{shape.description}</p>
              <div className="text-xs text-gray-500 space-y-1 mb-3">
                {shape.characteristics.map((char, index) => (
                  <div key={index}>• {char}</div>
                ))}
              </div>
              <div className="text-xs text-fitness-primary font-medium bg-fitness-primary/10 p-2 rounded">
                Diet Focus: {shape.dietFocus}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BodyShapeSelector;

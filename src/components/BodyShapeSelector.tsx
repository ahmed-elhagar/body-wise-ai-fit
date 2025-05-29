
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface BodyShapeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  gender: string;
  error?: string;
}

const BodyShapeSelector = ({ value, onChange, gender, error }: BodyShapeSelectorProps) => {
  const bodyShapes = [
    {
      id: 'ectomorph',
      name: 'Ectomorph',
      description: 'Naturally thin, fast metabolism',
      maleIcon: '🚶‍♂️',
      femaleIcon: '🚶‍♀️',
      characteristics: ['Lean build', 'Fast metabolism', 'Difficulty gaining weight'],
      dietFocus: 'High calorie, nutrient-dense foods, frequent meals'
    },
    {
      id: 'mesomorph',
      name: 'Mesomorph',
      description: 'Athletic build, gains muscle easily',
      maleIcon: '🏋️‍♂️',
      femaleIcon: '🏋️‍♀️',
      characteristics: ['Muscular build', 'Gains muscle easily', 'Moderate metabolism'],
      dietFocus: 'Balanced macros, moderate calories, pre/post workout nutrition'
    },
    {
      id: 'endomorph',
      name: 'Endomorph',
      description: 'Larger frame, slower metabolism',
      maleIcon: '👨‍💼',
      femaleIcon: '👩‍💼',
      characteristics: ['Larger frame', 'Slower metabolism', 'Gains weight easily'],
      dietFocus: 'Lower carbs, higher protein, portion control'
    },
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
    }
  ];

  return (
    <div>
      <Label className={`text-base font-semibold mb-4 block ${error ? 'text-red-600' : ''}`}>
        Select Your Body Shape
      </Label>
      <p className="text-sm text-gray-600 mb-6">
        This helps us understand your metabolism and create a personalized diet plan that works best for your body type.
      </p>
      {error && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bodyShapes.map((shape) => (
          <Card
            key={shape.id}
            className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              value === shape.id
                ? 'ring-2 ring-fitness-primary bg-fitness-primary/5'
                : 'hover:bg-gray-50'
            } ${error ? 'border-red-300' : ''}`}
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

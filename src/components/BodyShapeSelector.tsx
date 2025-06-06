
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
      maleIcon: '🕺',
      femaleIcon: '💃',
      characteristics: ['Lean build', 'Fast metabolism', 'Difficulty gaining weight'],
      color: 'blue'
    },
    {
      id: 'mesomorph',
      name: 'Mesomorph',
      description: 'Athletic build, gains muscle easily',
      maleIcon: '🏋️‍♂️',
      femaleIcon: '🏋️‍♀️',
      characteristics: ['Muscular build', 'Gains muscle easily', 'Moderate metabolism'],
      color: 'green'
    },
    {
      id: 'endomorph',
      name: 'Endomorph',
      description: 'Larger frame, slower metabolism',
      maleIcon: '🤵',
      femaleIcon: '👸',
      characteristics: ['Larger frame', 'Slower metabolism', 'Gains weight easily'],
      color: 'purple'
    },
    {
      id: 'apple',
      name: 'Apple Shape',
      description: 'Weight around midsection',
      maleIcon: '🍎',
      femaleIcon: '🍎',
      characteristics: ['Broader shoulders', 'Fuller midsection', 'Slimmer hips'],
      color: 'red'
    },
    {
      id: 'pear',
      name: 'Pear Shape',
      description: 'Weight in hips and thighs',
      maleIcon: '🍐',
      femaleIcon: '🍐',
      characteristics: ['Narrower shoulders', 'Smaller waist', 'Fuller hips'],
      color: 'yellow'
    },
    {
      id: 'hourglass',
      name: 'Hourglass',
      description: 'Balanced proportions',
      maleIcon: '⏳',
      femaleIcon: '⏳',
      characteristics: ['Balanced shoulders/hips', 'Defined waist', 'Proportionate build'],
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colorMap = {
      blue: isSelected ? 'ring-blue-500 bg-blue-50 border-blue-200' : 'hover:bg-blue-50',
      green: isSelected ? 'ring-green-500 bg-green-50 border-green-200' : 'hover:bg-green-50',
      purple: isSelected ? 'ring-purple-500 bg-purple-50 border-purple-200' : 'hover:bg-purple-50',
      red: isSelected ? 'ring-red-500 bg-red-50 border-red-200' : 'hover:bg-red-50',
      yellow: isSelected ? 'ring-yellow-500 bg-yellow-50 border-yellow-200' : 'hover:bg-yellow-50',
      indigo: isSelected ? 'ring-indigo-500 bg-indigo-50 border-indigo-200' : 'hover:bg-indigo-50'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div>
      <Label className={`text-base font-semibold mb-4 block ${error ? 'text-red-600' : ''}`}>
        Body Shape (Optional)
      </Label>
      <p className="text-sm text-gray-600 mb-6">
        This helps us understand your metabolism and create a personalized diet plan.
      </p>
      {error && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {bodyShapes.map((shape) => {
          const isSelected = value === shape.id;
          return (
            <Card
              key={shape.id}
              className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                isSelected
                  ? `ring-2 ${getColorClasses(shape.color, true)}`
                  : `${getColorClasses(shape.color, false)} border-gray-200`
              } ${error ? 'border-red-300' : ''}`}
              onClick={() => onChange(shape.id)}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">
                  {gender === 'female' ? shape.femaleIcon : shape.maleIcon}
                </div>
                <h3 className="font-semibold text-base mb-2 text-gray-800">{shape.name}</h3>
                <p className="text-xs text-gray-600 mb-3">{shape.description}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  {shape.characteristics.map((char, index) => (
                    <div key={index} className="flex items-center justify-center">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                      {char}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BodyShapeSelector;

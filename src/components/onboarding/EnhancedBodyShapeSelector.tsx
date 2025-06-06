
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EnhancedBodyShapeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  gender: string;
}

const EnhancedBodyShapeSelector = ({ value, onChange, gender }: EnhancedBodyShapeSelectorProps) => {
  const bodyShapes = [
    {
      id: 'very_slim',
      name: 'Very Slim',
      description: 'Extremely lean build',
      maleIcon: '🚶‍♂️',
      femaleIcon: '🚶‍♀️',
      bodyFat: gender === 'male' ? '5-10%' : '8-15%'
    },
    {
      id: 'slim',
      name: 'Slim',
      description: 'Naturally thin build',
      maleIcon: '🕺',
      femaleIcon: '💃',
      bodyFat: gender === 'male' ? '10-15%' : '15-20%'
    },
    {
      id: 'athletic',
      name: 'Athletic',
      description: 'Toned and fit',
      maleIcon: '🏃‍♂️',
      femaleIcon: '🏃‍♀️',
      bodyFat: gender === 'male' ? '15-18%' : '20-25%'
    },
    {
      id: 'average',
      name: 'Average',
      description: 'Medium build',
      maleIcon: '🧍‍♂️',
      femaleIcon: '🧍‍♀️',
      bodyFat: gender === 'male' ? '18-25%' : '25-30%'
    },
    {
      id: 'curvy',
      name: 'Curvy',
      description: 'Well-rounded figure',
      maleIcon: '🤵',
      femaleIcon: '👸',
      bodyFat: gender === 'male' ? '25-30%' : '30-35%'
    },
    {
      id: 'heavy',
      name: 'Heavy',
      description: 'Larger build',
      maleIcon: '👨‍💼',
      femaleIcon: '👩‍💼',
      bodyFat: gender === 'male' ? '30%+' : '35%+'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xl font-bold text-gray-800 mb-2 block">
          Choose your current body shape
        </Label>
        <p className="text-sm text-gray-600">Select the body type that best represents you</p>
      </div>
      
      <ScrollArea className="h-80 w-full rounded-xl border border-gray-200 p-4">
        <div className="space-y-3">
          {bodyShapes.map((shape) => {
            const isSelected = value === shape.id;
            return (
              <Card
                key={shape.id}
                className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                  isSelected
                    ? 'ring-4 ring-green-500/30 bg-green-50 border-green-500 shadow-md'
                    : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onChange(shape.id)}
                data-testid={`body-shape-${shape.id}`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl flex-shrink-0">
                    {gender === 'female' ? shape.femaleIcon : shape.maleIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-lg text-gray-800">{shape.name}</h3>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                        {shape.bodyFat}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{shape.description}</p>
                  </div>
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default EnhancedBodyShapeSelector;

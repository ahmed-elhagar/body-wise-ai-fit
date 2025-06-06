
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface GoalBodyTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const GoalBodyTypeSelector = ({ value, onChange }: GoalBodyTypeSelectorProps) => {
  const goalTypes = [
    {
      id: 'slim',
      name: 'Slim',
      description: 'Lean and toned',
      icon: '🏃‍♀️'
    },
    {
      id: 'fit', 
      name: 'Fit',
      description: 'Athletic and strong',
      icon: '💪'
    },
    {
      id: 'muscular',
      name: 'Muscular', 
      description: 'Well-defined muscles',
      icon: '🏋️‍♂️'
    },
    {
      id: 'bodybuilding',
      name: 'Bodybuilding',
      description: 'Maximum muscle mass',
      icon: '🥇'
    }
  ];

  return (
    <div className="space-y-4">
      <Label className="text-xl font-bold text-gray-800">
        Choose the body you want
      </Label>
      <div className="grid grid-cols-2 gap-4">
        {goalTypes.map((type) => {
          const isSelected = value === type.id;
          return (
            <Card
              key={type.id}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 aspect-square ${
                isSelected
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
              onClick={() => onChange(type.id)}
              data-testid={`goal-body-${type.id}`}
            >
              <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                <div className="text-4xl mb-2">{type.icon}</div>
                <h3 className="font-semibold text-lg text-gray-800">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default GoalBodyTypeSelector;

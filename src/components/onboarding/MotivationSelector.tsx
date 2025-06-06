
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface MotivationSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const MotivationSelector = ({ value, onChange }: MotivationSelectorProps) => {
  const motivations = [
    { id: 'look_better', label: 'Look better', emoji: '💪' },
    { id: 'feel_good', label: 'Feel good in your body', emoji: '😌' },
    { id: 'be_fitter', label: 'Be fitter', emoji: '🏃‍♂️' },
    { id: 'improve_health', label: 'Improve health', emoji: '🫁' },
    { id: 'reduce_stress', label: 'Reduce stress', emoji: '🧘‍♀️' }
  ];

  const handleToggle = (motivationId: string) => {
    const newValue = value.includes(motivationId)
      ? value.filter(id => id !== motivationId)
      : [...value, motivationId];
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xl font-bold text-gray-800">
          What motivates you to work out?
        </Label>
        <p className="text-sm text-gray-600 mt-1">Choose all that apply</p>
      </div>
      <div className="space-y-3">
        {motivations.map((motivation) => {
          const isSelected = value.includes(motivation.id);
          return (
            <Card
              key={motivation.id}
              className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                isSelected
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
              onClick={() => handleToggle(motivation.id)}
              data-testid={`motivation-${motivation.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{motivation.emoji}</span>
                  <span className="font-medium text-gray-800">{motivation.label}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MotivationSelector;

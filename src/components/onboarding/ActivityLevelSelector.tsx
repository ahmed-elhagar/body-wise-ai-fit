
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface ActivityLevelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ActivityLevelSelector = ({ value, onChange }: ActivityLevelSelectorProps) => {
  const activityLevels = [
    {
      id: 'sedentary',
      label: 'I spend most of the day sitting',
      emoji: '🧑‍💻',
      description: 'Desk job, minimal physical activity'
    },
    {
      id: 'lightly_active',
      label: 'I am active during my breaks',
      emoji: '🚶',
      description: 'Light exercise 1-3 days per week'
    },
    {
      id: 'very_active',
      label: 'I am on my feet all day',
      emoji: '🏃',
      description: 'Physical job or active lifestyle'
    }
  ];

  return (
    <div className="space-y-4">
      <Label className="text-xl font-bold text-gray-800">
        How would you describe your typical day?
      </Label>
      <div className="space-y-3">
        {activityLevels.map((level) => {
          const isSelected = value === level.id;
          return (
            <Card
              key={level.id}
              className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                isSelected
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
              onClick={() => onChange(level.id)}
              data-testid={`activity-level-${level.id}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{level.emoji}</span>
                <div>
                  <span className="font-medium text-gray-800 block">{level.label}</span>
                  <span className="text-sm text-gray-600">{level.description}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityLevelSelector;

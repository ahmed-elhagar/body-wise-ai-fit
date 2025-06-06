
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface ActivityLevelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ActivityLevelSelector = ({ value, onChange }: ActivityLevelSelectorProps) => {
  const activityLevels = [
    {
      value: 'sedentary',
      title: 'Sedentary',
      description: 'Little to no exercise, desk job',
      icon: '🪑'
    },
    {
      value: 'light',
      title: 'Lightly Active',
      description: 'Light exercise 1-3 times per week',
      icon: '🚶'
    },
    {
      value: 'moderate',
      title: 'Moderately Active', 
      description: 'Moderate exercise 3-5 times per week',
      icon: '🏃'
    },
    {
      value: 'active',
      title: 'Very Active',
      description: 'Hard exercise 6-7 times per week',
      icon: '🏋️'
    },
    {
      value: 'very_active',
      title: 'Extremely Active',
      description: 'Very hard exercise, physical job',
      icon: '🤸'
    }
  ];

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        How active are you currently?
      </Label>
      
      <div className="grid gap-3">
        {activityLevels.map((level) => (
          <Card
            key={level.value}
            className={`p-4 cursor-pointer transition-all duration-300 border-2 hover:shadow-md ${
              value === level.value
                ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md'
                : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => onChange(level.value)}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{level.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{level.title}</h4>
                <p className="text-sm text-gray-600">{level.description}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                value === level.value
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-gray-300'
              }`}>
                {value === level.value && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActivityLevelSelector;

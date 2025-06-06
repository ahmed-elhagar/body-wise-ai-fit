
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bed, Walk, Bike, Zap } from "lucide-react";

interface ActivityLevelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ActivityLevelSelector = ({ value, onChange }: ActivityLevelSelectorProps) => {
  const activityLevels = [
    { 
      id: 'sedentary', 
      label: 'Sedentary', 
      icon: Bed, 
      color: 'text-gray-500',
      description: 'Little to no exercise, desk job'
    },
    { 
      id: 'light', 
      label: 'Lightly Active', 
      icon: Walk, 
      color: 'text-blue-500',
      description: 'Light exercise 1-3 days/week'
    },
    { 
      id: 'moderate', 
      label: 'Moderately Active', 
      icon: Bike, 
      color: 'text-green-500',
      description: 'Moderate exercise 3-5 days/week'
    },
    { 
      id: 'very_active', 
      label: 'Very Active', 
      icon: Zap, 
      color: 'text-orange-500',
      description: 'Hard exercise 6-7 days/week'
    },
  ];

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        How active are you? *
      </Label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activityLevels.map((level) => {
          const Icon = level.icon;
          const isSelected = value === level.id;
          
          return (
            <Button
              key={level.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              className={`h-auto p-4 flex flex-col items-start gap-3 text-left ${
                isSelected ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => onChange(level.id)}
            >
              <div className="flex items-center gap-3 w-full">
                <Icon className={`w-6 h-6 ${level.color}`} />
                <span className="font-medium">{level.label}</span>
              </div>
              <p className="text-sm text-gray-500">{level.description}</p>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityLevelSelector;

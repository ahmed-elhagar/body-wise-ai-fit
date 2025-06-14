
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bed, User, Bike, Zap, Flame } from "lucide-react";

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
      id: 'lightly_active', 
      label: 'Lightly Active', 
      icon: User, 
      color: 'text-blue-500',
      description: 'Light exercise 1-3 days/week'
    },
    { 
      id: 'moderately_active', 
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
    { 
      id: 'extremely_active', 
      label: 'Extremely Active', 
      icon: Flame, 
      color: 'text-red-500',
      description: 'Very hard exercise, physical job'
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
              className={`h-auto p-4 flex flex-col items-start gap-3 text-left transition-all duration-200 ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-500' : 'hover:border-blue-300'
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

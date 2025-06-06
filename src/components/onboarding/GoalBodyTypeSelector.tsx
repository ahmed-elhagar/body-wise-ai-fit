
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TrendingDown, Zap, TrendingUp, Target } from "lucide-react";

interface GoalBodyTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const GoalBodyTypeSelector = ({ value, onChange }: GoalBodyTypeSelectorProps) => {
  const goals = [
    { 
      id: 'lose_weight', 
      label: 'Lose Weight', 
      icon: TrendingDown, 
      color: 'text-red-500',
      description: 'Reduce body fat and get lean'
    },
    { 
      id: 'gain_muscle', 
      label: 'Build Muscle', 
      icon: TrendingUp, 
      color: 'text-green-500',
      description: 'Increase muscle mass and strength'
    },
    { 
      id: 'maintain', 
      label: 'Stay Healthy', 
      icon: Target, 
      color: 'text-blue-500',
      description: 'Maintain current fitness level'
    },
    { 
      id: 'endurance', 
      label: 'Build Endurance', 
      icon: Zap, 
      color: 'text-yellow-500',
      description: 'Improve cardiovascular fitness'
    },
  ];

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        What's your main fitness goal? *
      </Label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const isSelected = value === goal.id;
          
          return (
            <Button
              key={goal.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              className={`h-auto p-4 flex flex-col items-start gap-3 text-left ${
                isSelected ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => onChange(goal.id)}
            >
              <div className="flex items-center gap-3 w-full">
                <Icon className={`w-6 h-6 ${goal.color}`} />
                <span className="font-medium">{goal.label}</span>
              </div>
              <p className="text-sm text-gray-500">{goal.description}</p>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default GoalBodyTypeSelector;


import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Building, Dumbbell } from 'lucide-react';

interface WorkoutTypeSelectorProps {
  selectedType: "home" | "gym";
  onTypeChange: (type: "home" | "gym") => void;
}

export const WorkoutTypeSelector: React.FC<WorkoutTypeSelectorProps> = ({
  selectedType,
  onTypeChange
}) => {
  const workoutTypes = [
    {
      value: 'home' as const,
      label: 'Home Workout',
      icon: Home,
      description: 'Bodyweight & minimal equipment',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      value: 'gym' as const,
      label: 'Gym Workout',
      icon: Building,
      description: 'Full equipment access',
      gradient: 'from-blue-400 to-indigo-500'
    }
  ];

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
        <Dumbbell className="h-4 w-4 mr-2 text-indigo-600" />
        Workout Environment
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {workoutTypes.map((type) => (
          <Button
            key={type.value}
            onClick={() => onTypeChange(type.value)}
            variant={selectedType === type.value ? "default" : "outline"}
            className={`p-4 h-auto flex-col items-start text-left ${
              selectedType === type.value
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2 w-full">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${type.gradient}`}>
                <type.icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-gray-900">{type.label}</span>
                {selectedType === type.value && (
                  <Badge className="ml-2 bg-indigo-100 text-indigo-700">Active</Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 w-full">{type.description}</p>
          </Button>
        ))}
      </div>
    </Card>
  );
};

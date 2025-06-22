
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Home, Users, Target } from "lucide-react";

interface WorkoutType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: 'none' | 'basic' | 'full';
}

interface WorkoutTypeSelectorProps {
  selectedType?: string;
  onSelect: (type: string) => void;
}

const workoutTypes: WorkoutType[] = [
  {
    id: 'strength',
    name: 'Strength Training',
    description: 'Build muscle and increase strength',
    icon: <Dumbbell className="w-6 h-6" />,
    difficulty: 'intermediate',
    equipment: 'full'
  },
  {
    id: 'cardio',
    name: 'Cardio',
    description: 'Improve cardiovascular fitness',
    icon: <Target className="w-6 h-6" />,
    difficulty: 'beginner',
    equipment: 'none'
  },
  {
    id: 'home',
    name: 'Home Workout',
    description: 'No equipment required',
    icon: <Home className="w-6 h-6" />,
    difficulty: 'beginner',
    equipment: 'none'
  },
  {
    id: 'group',
    name: 'Group Fitness',
    description: 'Social and motivating workouts',
    icon: <Users className="w-6 h-6" />,
    difficulty: 'intermediate',
    equipment: 'basic'
  }
];

export const WorkoutTypeSelector = ({ selectedType, onSelect }: WorkoutTypeSelectorProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEquipmentColor = (equipment: string) => {
    switch (equipment) {
      case 'none': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-purple-100 text-purple-800';
      case 'full': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {workoutTypes.map((type) => (
        <Card 
          key={type.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedType === type.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
          }`}
          onClick={() => onSelect(type.id)}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                {type.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{type.description}</p>
                <div className="flex gap-2">
                  <Badge className={getDifficultyColor(type.difficulty)}>
                    {type.difficulty}
                  </Badge>
                  <Badge className={getEquipmentColor(type.equipment)}>
                    {type.equipment === 'none' ? 'No Equipment' : 
                     type.equipment === 'basic' ? 'Basic Equipment' : 'Full Gym'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

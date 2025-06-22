import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell, 
  Activity, 
  Users, 
  Zap,
  Brain,
  TrendingUp
} from 'lucide-react';

interface WorkoutTypeOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  equipment?: string[];
  aiFeatures?: string[];
}

interface WorkoutTypeSelectorProps {
  workoutType: string;
  setWorkoutType: (type: string) => void;
  revolutionMode?: boolean;
}

export const WorkoutTypeSelector: React.FC<WorkoutTypeSelectorProps> = ({
  workoutType,
  setWorkoutType,
  revolutionMode = false
}) => {
  const workoutTypes: WorkoutTypeOption[] = revolutionMode ? [
    { 
      id: 'ai-strength', 
      name: 'AI Strength', 
      icon: <Brain className="h-4 w-4" />,
      description: 'Equipment-aware progressive overload',
      equipment: ['dumbbells', 'barbell', 'machines'],
      aiFeatures: ['Progressive overload', 'Form analysis', 'Auto-progression']
    },
    { 
      id: 'smart-cardio', 
      name: 'Smart Cardio', 
      icon: <Activity className="h-4 w-4" />,
      description: 'Heart rate optimized training',
      equipment: ['treadmill', 'bike', 'bodyweight'],
      aiFeatures: ['HR zone targeting', 'Interval optimization', 'Recovery tracking']
    },
    { 
      id: 'mobility-plus', 
      name: 'Mobility+', 
      icon: <Users className="h-4 w-4" />,
      description: 'AI-guided flexibility & recovery',
      equipment: ['yoga mat', 'resistance bands'],
      aiFeatures: ['Movement screening', 'Corrective exercises', 'Injury prevention']
    },
    { 
      id: 'hiit-intelligence', 
      name: 'HIIT Intelligence', 
      icon: <Zap className="h-4 w-4" />,
      description: 'Adaptive high-intensity training',
      equipment: ['bodyweight', 'kettlebells', 'battle ropes'],
      aiFeatures: ['Intensity adaptation', 'Recovery optimization', 'Performance tracking']
    }
  ] : [
    { 
      id: 'strength', 
      name: 'Strength Training', 
      icon: <Dumbbell className="h-4 w-4" />,
      description: 'Build muscle and increase strength'
    },
    { 
      id: 'cardio', 
      name: 'Cardio', 
      icon: <Activity className="h-4 w-4" />,
      description: 'Improve cardiovascular fitness'
    },
    { 
      id: 'flexibility', 
      name: 'Flexibility', 
      icon: <Users className="h-4 w-4" />,
      description: 'Enhance mobility and flexibility'
    },
    { 
      id: 'hiit', 
      name: 'HIIT', 
      icon: <Zap className="h-4 w-4" />,
      description: 'High-intensity interval training'
    }
  ];

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center">
          {revolutionMode && <Brain className="h-5 w-5 mr-2 text-indigo-600" />}
          {revolutionMode ? 'AI Workout Intelligence' : 'Workout Type'}
        </h3>
        {revolutionMode && (
          <Button variant="outline" size="sm" className="bg-indigo-50 border-indigo-200">
            <TrendingUp className="h-4 w-4 mr-2" />
            Progressive Mode
          </Button>
        )}
      </div>
      
      <div className={`grid gap-4 ${
        revolutionMode 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' 
          : 'grid-cols-2 md:grid-cols-4'
      }`}>
        {workoutTypes.map((type) => (
          <div
            key={type.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              workoutType === type.id
                ? revolutionMode
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
            onClick={() => setWorkoutType(type.id)}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className={`p-2 rounded-md ${
                workoutType === type.id 
                  ? revolutionMode
                    ? 'bg-indigo-500 text-white'
                    : 'bg-brand-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {type.icon}
              </div>
              <div>
                <h4 className="font-semibold text-sm">{type.name}</h4>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 mb-2">{type.description}</p>
            
            {revolutionMode && type.equipment && (
              <div className="space-y-1">
                <div className="flex flex-wrap gap-1">
                  {type.equipment.slice(0, 2).map((eq) => (
                    <Badge key={eq} variant="secondary" className="text-xs">
                      {eq}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-indigo-600 font-medium">
                  {type.aiFeatures?.length} AI Features
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}; 
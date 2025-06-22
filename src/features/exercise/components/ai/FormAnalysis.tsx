import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  Video, 
  Shield, 
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Dumbbell
} from 'lucide-react';
import GradientCard from '@/shared/components/design-system/GradientCard';
import { Exercise } from '../../types';

interface FormAnalysisProps {
  todaysExercises: Exercise[];
  activeExerciseId: string | null;
  revolutionMode?: boolean;
}

export const FormAnalysis: React.FC<FormAnalysisProps> = ({
  todaysExercises,
  activeExerciseId,
  revolutionMode = false
}) => {
  return (
    <div className="space-y-6">
      <GradientCard variant="accent" className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-white rounded-lg">
            <Camera className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Form Analysis</h3>
            <p className="text-white/80">Real-time exercise form correction and safety</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Video className="h-5 w-5 text-white" />
              <span className="text-white font-medium">Live Analysis</span>
            </div>
            <p className="text-white/70 text-sm">Camera-based form tracking</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-white" />
              <span className="text-white font-medium">Safety Alerts</span>
            </div>
            <p className="text-white/70 text-sm">Injury prevention warnings</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="h-5 w-5 text-white" />
              <span className="text-white font-medium">Form Tips</span>
            </div>
            <p className="text-white/70 text-sm">Personalized corrections</p>
          </div>
        </div>
      </GradientCard>

      {todaysExercises.map((exercise, index) => (
        <Card key={exercise.id} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Dumbbell className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold">{exercise.name}</h4>
                <p className="text-sm text-gray-600">{exercise.sets} sets × {exercise.reps} reps</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">
                Form Score: 94/100
              </Badge>
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4 mr-2" />
                Analyze
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Good Form</span>
              </div>
              <p className="text-xs text-green-700">Proper spine alignment</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Minor Issue</span>
              </div>
              <p className="text-xs text-yellow-700">Slightly fast tempo</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Tip</span>
              </div>
              <p className="text-xs text-blue-700">Focus on controlled movement</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}; 
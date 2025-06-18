
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Youtube, Play, CheckCircle } from "lucide-react";

interface ExerciseCardProps {
  exercise: any;
  index: number;
  onComplete?: (exerciseId: string) => void;
  showActions?: boolean;
}

export const ExerciseCard = ({ 
  exercise, 
  index, 
  onComplete,
  showActions = true 
}: ExerciseCardProps) => {
  return (
    <Card 
      className={`p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
        exercise.completed ? 'bg-green-50/80' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            exercise.completed 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {exercise.completed ? <CheckCircle className="w-5 h-5" /> : exercise.order_number || index + 1}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {exercise.name}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <span>{exercise.sets} sets × {exercise.reps} reps</span>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {exercise.rest_seconds}s rest
              </span>
              <span className="flex items-center">
                <Target className="w-3 h-3 mr-1" />
                {exercise.muscle_groups?.join(', ') || 'Full Body'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {exercise.equipment || 'Bodyweight'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {exercise.difficulty || 'Beginner'}
              </Badge>
            </div>
            {exercise.instructions && (
              <p className="text-sm text-gray-600 mt-2">{exercise.instructions}</p>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="flex space-x-2">
            {exercise.youtube_search_term && (
              <Button
                size="sm"
                variant="outline"
                className="bg-white/80"
                onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.youtube_search_term)}`, '_blank')}
              >
                <Youtube className="w-4 h-4 mr-1" />
                Tutorial
              </Button>
            )}
            {!exercise.completed && onComplete && (
              <Button
                size="sm"
                className="bg-fitness-gradient hover:opacity-90 text-white"
                onClick={() => onComplete(exercise.id)}
              >
                <Play className="w-4 h-4 mr-1" />
                Complete
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};


import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Youtube, Play, CheckCircle, Check } from "lucide-react";

interface ExerciseCardProps {
  exercise: any;
  index: number;
  onComplete: () => void;
}

export const ExerciseCard = ({ exercise, index, onComplete }: ExerciseCardProps) => {
  return (
    <Card 
      className={`p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
        exercise.completed ? 'bg-green-50/80 border-green-200' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
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
              <span className="font-medium">{exercise.sets} sets × {exercise.reps} reps</span>
              {exercise.rest_seconds && (
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {exercise.rest_seconds}s rest
                </span>
              )}
              <span className="flex items-center">
                <Target className="w-3 h-3 mr-1" />
                {exercise.muscle_groups?.join(', ') || 'Full Body'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {exercise.equipment || 'Bodyweight'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {exercise.difficulty || 'Beginner'}
              </Badge>
            </div>
            
            {exercise.instructions && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{exercise.instructions}</p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 ml-4">
          {exercise.youtube_search_term && (
            <Button
              size="sm"
              variant="outline"
              className="bg-white/80 whitespace-nowrap"
              onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.youtube_search_term)}`, '_blank')}
            >
              <Youtube className="w-4 h-4 mr-1" />
              Tutorial
            </Button>
          )}
          
          {exercise.completed ? (
            <Button
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white whitespace-nowrap"
              disabled
            >
              <Check className="w-4 h-4 mr-1" />
              Completed
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-fitness-gradient hover:opacity-90 text-white whitespace-nowrap"
              onClick={onComplete}
            >
              <Play className="w-4 h-4 mr-1" />
              Complete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

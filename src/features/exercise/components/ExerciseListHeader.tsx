
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Timer, 
  List, 
  Plus,
  TrendingUp
} from "lucide-react";
import { useState } from "react";

interface ExerciseListHeaderProps {
  completedCount: number;
  totalCount: number;
  viewMode: 'session' | 'list';
  onViewModeChange: (mode: 'session' | 'list') => void;
  dailyWorkoutId?: string;
}

export const ExerciseListHeader = ({
  completedCount,
  totalCount,
  viewMode,
  onViewModeChange,
  dailyWorkoutId
}: ExerciseListHeaderProps) => {
  const [showCustomExerciseDialog, setShowCustomExerciseDialog] = useState(false);

  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card className="p-4 bg-gradient-to-r from-fitness-accent-50 to-fitness-secondary-50 border-fitness-accent-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-fitness-primary-800 mb-1">
            Today's Workout
          </h2>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-fitness-primary-100 text-fitness-primary-700">
              <TrendingUp className="w-3 h-3 mr-1" />
              {completedCount}/{totalCount} Complete
            </Badge>
            <span className="text-sm text-fitness-primary-600">
              {Math.round(progressPercentage)}% Progress
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {dailyWorkoutId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomExerciseDialog(true)}
              className="border-fitness-accent-300 text-fitness-accent-700 hover:bg-fitness-accent-50"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Exercise
            </Button>
          )}
          
          <div className="flex items-center bg-white rounded-lg p-1 border border-fitness-neutral-200">
            <Button
              variant={viewMode === 'session' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('session')}
              className={`text-xs ${viewMode === 'session' ? 'bg-fitness-primary-500 text-white' : 'text-fitness-primary-600'}`}
            >
              <Timer className="w-3 h-3 mr-1" />
              Session
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className={`text-xs ${viewMode === 'list' ? 'bg-fitness-primary-500 text-white' : 'text-fitness-primary-600'}`}
            >
              <List className="w-3 h-3 mr-1" />
              List
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

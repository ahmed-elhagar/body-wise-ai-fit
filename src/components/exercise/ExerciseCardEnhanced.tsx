
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Youtube, CheckCircle, Play, Edit3 } from "lucide-react";
import { useState } from "react";
import { ExerciseProgressDialog } from "./ExerciseProgressDialog";

interface ExerciseCardEnhancedProps {
  exercise: any;
  index: number;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
}

export const ExerciseCardEnhanced = ({ 
  exercise, 
  index, 
  onExerciseComplete,
  onExerciseProgressUpdate 
}: ExerciseCardEnhancedProps) => {
  const [showProgressDialog, setShowProgressDialog] = useState(false);

  const handleQuickComplete = () => {
    onExerciseComplete(exercise.id);
  };

  const handleProgressUpdate = (sets: number, reps: string, notes?: string) => {
    onExerciseProgressUpdate(exercise.id, sets, reps, notes);
    setShowProgressDialog(false);
  };

  return (
    <>
      <Card className={`p-3 transition-all duration-200 ${
        exercise.completed 
          ? 'bg-green-50 border-green-200 shadow-sm' 
          : 'bg-white hover:shadow-md border-health-border'
      }`}>
        <div className="flex items-center gap-3">
          {/* Exercise Number/Status */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
            exercise.completed 
              ? 'bg-green-500 text-white' 
              : 'bg-health-soft text-health-primary'
          }`}>
            {exercise.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
          </div>

          {/* Exercise Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-health-text-primary text-sm leading-tight">
                {exercise.name}
              </h3>
              <div className="flex gap-1 ml-2">
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  {exercise.equipment || 'Bodyweight'}
                </Badge>
              </div>
            </div>

            {/* Exercise Details */}
            <div className="flex items-center gap-3 text-xs text-health-text-secondary mb-2">
              <span className="font-medium">{exercise.sets} × {exercise.reps}</span>
              {exercise.rest_seconds && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {exercise.rest_seconds}s
                </span>
              )}
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {exercise.muscle_groups?.slice(0, 2).join(', ') || 'Full Body'}
              </span>
            </div>

            {/* Instructions (truncated) */}
            {exercise.instructions && (
              <p className="text-xs text-health-text-secondary line-clamp-1">
                {exercise.instructions}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1">
            {exercise.youtube_search_term && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-2"
                onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.youtube_search_term)}`, '_blank')}
              >
                <Youtube className="w-3 h-3" />
              </Button>
            )}

            {!exercise.completed && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2"
                  onClick={() => setShowProgressDialog(true)}
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-3 bg-health-primary hover:bg-health-primary/90"
                  onClick={handleQuickComplete}
                >
                  <Play className="w-3 h-3 mr-1" />
                  Done
                </Button>
              </>
            )}

            {exercise.completed && (
              <Button
                size="sm"
                className="h-8 px-3 bg-green-500 hover:bg-green-600"
                disabled
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Done
              </Button>
            )}
          </div>
        </div>
      </Card>

      <ExerciseProgressDialog
        open={showProgressDialog}
        onOpenChange={setShowProgressDialog}
        exercise={exercise}
        onSave={handleProgressUpdate}
      />
    </>
  );
};

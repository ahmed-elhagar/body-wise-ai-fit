
import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Target,
  MoreVertical,
  Edit3,
  Save,
  X,
  Timer,
  Dumbbell,
  RotateCcw
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface InteractiveExerciseCardProps {
  exercise: any;
  index: number;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
}

export const InteractiveExerciseCard = ({
  exercise,
  index,
  onExerciseComplete,
  onExerciseProgressUpdate
}: InteractiveExerciseCardProps) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [editData, setEditData] = useState({
    sets: exercise.actual_sets || exercise.sets || 0,
    reps: exercise.actual_reps || exercise.reps || '',
    notes: exercise.notes || ''
  });

  const handleSaveProgress = useCallback(() => {
    onExerciseProgressUpdate(
      exercise.id,
      editData.sets,
      editData.reps,
      editData.notes
    );
    setIsEditing(false);
  }, [exercise.id, editData, onExerciseProgressUpdate]);

  const handleComplete = useCallback(() => {
    onExerciseComplete(exercise.id);
  }, [exercise.id, onExerciseComplete]);

  const progressPercentage = exercise.completed ? 100 : 
    (editData.sets > 0 || editData.reps !== '' ? 50 : 0);

  return (
    <Card className={`p-3 transition-all duration-200 ${
      exercise.completed 
        ? 'bg-green-50 border-green-200' 
        : isActive 
        ? 'bg-blue-50 border-blue-200 shadow-md' 
        : 'hover:shadow-sm'
    }`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                #{index + 1}
              </Badge>
              {exercise.completed && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
            <h4 className={`font-medium text-sm ${
              exercise.completed ? 'text-green-800 line-through' : 'text-gray-900'
            }`}>
              {exercise.name}
            </h4>
            <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {exercise.sets || 0} sets × {exercise.reps || 0}
              </span>
              {exercise.rest_seconds && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {Math.floor(exercise.rest_seconds / 60)}:{(exercise.rest_seconds % 60).toString().padStart(2, '0')} rest
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {!exercise.completed && (
              <>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
                <Button
                  onClick={handleComplete}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-1" />
        </div>

        {/* Edit Mode */}
        {isEditing && !exercise.completed && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Sets Completed
                </label>
                <Input
                  type="number"
                  value={editData.sets}
                  onChange={(e) => setEditData(prev => ({ ...prev, sets: parseInt(e.target.value) || 0 }))}
                  className="h-8 text-sm"
                  min="0"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Reps/Weight
                </label>
                <Input
                  value={editData.reps}
                  onChange={(e) => setEditData(prev => ({ ...prev, reps: e.target.value }))}
                  className="h-8 text-sm"
                  placeholder="12 reps @ 50kg"
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Notes (optional)
              </label>
              <Textarea
                value={editData.notes}
                onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                className="text-sm resize-none"
                rows={2}
                placeholder="How did it feel? Any modifications?"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSaveProgress}
                size="sm"
                className="flex-1 h-7 text-xs"
              >
                <Save className="w-3 h-3 mr-1" />
                Save Progress
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                size="sm"
                className="h-7 px-2"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Current Progress Display */}
        {(editData.sets > 0 || editData.reps !== '' || editData.notes) && !isEditing && (
          <div className="bg-blue-50 rounded-lg p-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {editData.sets > 0 && (
                  <div className="text-blue-800">
                    <span className="font-medium">Completed:</span> {editData.sets} sets
                  </div>
                )}
                {editData.reps && (
                  <div className="text-blue-700">
                    <span className="font-medium">Performance:</span> {editData.reps}
                  </div>
                )}
                {editData.notes && (
                  <div className="text-blue-600 mt-1">
                    <span className="font-medium">Notes:</span> {editData.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Equipment & Muscle Groups */}
        {(exercise.equipment || exercise.muscle_groups) && (
          <div className="flex flex-wrap gap-1">
            {exercise.equipment && (
              <Badge variant="secondary" className="text-xs">
                <Dumbbell className="w-3 h-3 mr-1" />
                {exercise.equipment}
              </Badge>
            )}
            {exercise.muscle_groups?.slice(0, 2).map((muscle: string) => (
              <Badge key={muscle} variant="outline" className="text-xs">
                {muscle}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

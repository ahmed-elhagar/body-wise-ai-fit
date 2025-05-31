
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle, Edit, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  rest_seconds?: number;
  instructions?: string;
  completed: boolean;
  equipment?: string;
  muscle_groups?: string[];
}

interface ExerciseListProps {
  exercises: Exercise[];
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isRestDay: boolean;
}

const ExerciseList = ({ exercises, onExerciseComplete, onExerciseProgressUpdate, isRestDay }: ExerciseListProps) => {
  const { t } = useLanguage();

  if (isRestDay) {
    return (
      <Card className="bg-white border border-gray-100 shadow-sm rounded-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Rest Day</h3>
        <p className="text-gray-600 text-sm">
          Take this time to recover and prepare for your next workout session.
        </p>
      </Card>
    );
  }

  if (exercises.length === 0) {
    return (
      <Card className="bg-white border border-gray-100 shadow-sm rounded-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
          <Play className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">No Exercises</h3>
        <p className="text-gray-600 text-sm">
          No exercises scheduled for this day.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-800">Exercise List</h2>
        <Badge variant="outline" className="text-sm">
          {exercises.length} exercises
        </Badge>
      </div>

      <div className="space-y-3">
        {exercises.map((exercise, index) => (
          <Card 
            key={exercise.id}
            className="bg-white border border-gray-100 shadow-sm rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <CardTitle className="text-base font-medium text-gray-800">
                      {exercise.name}
                    </CardTitle>
                    {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {exercise.muscle_groups.slice(0, 2).map((muscle) => (
                          <Badge key={muscle} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {exercise.completed && (
                  <Badge variant="success" className="bg-green-500 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {exercise.sets && (
                  <div className="text-center">
                    <div className="text-lg font-medium text-gray-800">{exercise.sets}</div>
                    <div className="text-xs text-gray-500">sets</div>
                  </div>
                )}
                
                {exercise.reps && (
                  <div className="text-center">
                    <div className="text-lg font-medium text-blue-600">{exercise.reps}</div>
                    <div className="text-xs text-gray-500">reps</div>
                  </div>
                )}
                
                {exercise.rest_seconds && (
                  <div className="text-center">
                    <div className="text-lg font-medium text-orange-600">{exercise.rest_seconds}s</div>
                    <div className="text-xs text-gray-500">rest</div>
                  </div>
                )}
              </div>

              {exercise.equipment && (
                <div className="mb-4">
                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700">
                    {exercise.equipment}
                  </Badge>
                </div>
              )}

              {exercise.instructions && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {exercise.instructions}
                </p>
              )}

              <div className="flex gap-2">
                {!exercise.completed ? (
                  <Button
                    onClick={() => onExerciseComplete(exercise.id)}
                    variant="default"
                    size="sm"
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete
                  </Button>
                ) : (
                  <Button
                    onClick={() => onExerciseProgressUpdate(exercise.id, exercise.sets || 0, exercise.reps || '', '')}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Progress
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExerciseList;

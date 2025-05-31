
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle, Clock, Repeat, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest_time: string;
  instructions?: string;
  muscle_group?: string;
  equipment?: string;
  video_url?: string;
  completed?: boolean;
  progress_sets?: number;
  progress_reps?: string;
  notes?: string;
}

interface ExerciseListProps {
  exercises: Exercise[];
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isRestDay: boolean;
}

const ExerciseList = ({ 
  exercises, 
  onExerciseComplete, 
  onExerciseProgressUpdate,
  isRestDay 
}: ExerciseListProps) => {
  const { t } = useLanguage();
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  if (isRestDay) {
    return (
      <Card className="p-12 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-3">
          {t('exercise:restDay')}
        </h3>
        <p className="text-green-700 text-lg">
          {t('exercise:enjoyYourRest')}
        </p>
      </Card>
    );
  }

  if (exercises.length === 0) {
    return (
      <Card className="p-12 text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center">
          <Play className="w-12 h-12 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          {t('exercise:noExercises')}
        </h3>
        <p className="text-gray-600 text-lg">
          {t('exercise:noExercisesMessage')}
        </p>
      </Card>
    );
  }

  const getMuscleGroupColor = (muscleGroup: string) => {
    const colors: Record<string, string> = {
      'chest': 'bg-red-500',
      'back': 'bg-blue-500',
      'shoulders': 'bg-orange-500',
      'arms': 'bg-purple-500',
      'legs': 'bg-green-500',
      'core': 'bg-yellow-500',
      'full_body': 'bg-indigo-500'
    };
    return colors[muscleGroup?.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {t('exercise:exerciseList')}
        </h2>
        <Badge variant="outline" className="bg-white/50">
          {exercises.length} {t('exercise:exercises')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {exercises.map((exercise, index) => (
          <Card 
            key={exercise.id}
            className={`group transition-all duration-300 hover:shadow-lg ${
              exercise.completed 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                : 'bg-white/90 backdrop-blur-sm border-0 shadow-md hover:scale-[1.01]'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center font-bold text-indigo-600">
                    {index + 1}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800 leading-tight">
                      {exercise.name}
                    </CardTitle>
                    {exercise.muscle_group && (
                      <Badge 
                        variant="secondary" 
                        className={`${getMuscleGroupColor(exercise.muscle_group)} text-white text-xs mt-1`}
                      >
                        {exercise.muscle_group}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {exercise.completed && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-indigo-600">
                    {exercise.progress_sets || exercise.sets}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {t('exercise:sets')}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {exercise.progress_reps || exercise.reps}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {t('exercise:reps')}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600 flex items-center justify-center gap-1">
                    <Clock className="w-4 h-4" />
                    {exercise.rest_time}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {t('exercise:rest')}
                  </div>
                </div>
              </div>

              {/* Equipment */}
              {exercise.equipment && (
                <div className="mb-3">
                  <Badge variant="outline" className="text-xs">
                    {exercise.equipment}
                  </Badge>
                </div>
              )}

              {/* Instructions */}
              {exercise.instructions && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {exercise.instructions}
                  </p>
                </div>
              )}

              {/* Notes */}
              {exercise.notes && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 font-medium">
                    Notes: {exercise.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {exercise.video_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 hover:bg-red-50 border-red-200 text-red-600"
                    onClick={() => window.open(exercise.video_url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t('exercise:watchVideo')}
                  </Button>
                )}
                
                {!exercise.completed ? (
                  <Button
                    onClick={() => onExerciseComplete(exercise.id)}
                    variant="default"
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t('exercise:markComplete')}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 hover:bg-indigo-50 border-indigo-200 text-indigo-600"
                    onClick={() => setExpandedExercise(
                      expandedExercise === exercise.id ? null : exercise.id
                    )}
                  >
                    <Repeat className="w-4 h-4 mr-2" />
                    {t('exercise:editProgress')}
                  </Button>
                )}
              </div>

              {/* Progress Edit Form */}
              {expandedExercise === exercise.id && (
                <div className="mt-4 p-4 bg-indigo-50 rounded-lg space-y-3">
                  <h4 className="font-semibold text-indigo-800">
                    {t('exercise:editProgress')}
                  </h4>
                  {/* This would contain form inputs for editing progress */}
                  <p className="text-sm text-indigo-600">
                    Progress editing form would go here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExerciseList;

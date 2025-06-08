
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, Clock, Target, CheckCircle, Play, Youtube, MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  rest_seconds?: number;
  muscle_groups?: string[];
  instructions?: string;
  youtube_search_term?: string;
  equipment?: string;
  difficulty?: string;
  completed?: boolean;
}

interface ExerciseListProps {
  exercises: Exercise[];
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isRestDay?: boolean;
}

const ExerciseList = ({ 
  exercises, 
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay = false
}: ExerciseListProps) => {
  const { t } = useLanguage();
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  // Rest Day Display
  if (isRestDay) {
    return (
      <div className="p-8">
        <div className="text-center max-w-md mx-auto space-y-6">
          {/* Rest Day Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-fitness-orange-100 to-fitness-orange-200 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">😴</span>
          </div>
          
          {/* Rest Day Content */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-fitness-orange-800">
              {t('exercise.restDay')}
            </h3>
            <p className="text-fitness-orange-600 leading-relaxed">
              {t('exercise.restDayMessage') || 'Take time to recover and prepare for tomorrow\'s workout'}
            </p>
          </div>

          {/* Rest Day Activities */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              size="lg"
              className="w-full border-2 border-fitness-orange-300 text-fitness-orange-700 hover:bg-fitness-orange-50 hover:border-fitness-orange-400"
              onClick={() => window.open('https://www.youtube.com/results?search_query=stretching+routine', '_blank')}
            >
              <Youtube className="w-5 h-5 mr-2" />
              {t('exercise.stretchingVideos')}
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="w-full border-2 border-fitness-secondary-300 text-fitness-secondary-700 hover:bg-fitness-secondary-50 hover:border-fitness-secondary-400"
              onClick={() => window.open('https://www.youtube.com/results?search_query=meditation+relaxation', '_blank')}
            >
              <Target className="w-5 h-5 mr-2" />
              {t('exercise.meditation')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty exercises state
  if (!exercises || exercises.length === 0) {
    return (
      <div className="p-8">
        <div className="text-center max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
            <Dumbbell className="w-8 h-8 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {t('exercise.noExercises')}
            </h3>
            <p className="text-gray-600">
              {t('exercise.noExercisesMessage')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {t('exercise.todaysWorkout')}
          </h2>
          <p className="text-gray-600">
            {exercises.length} {t('exercise.exercises')} • {t('exercise.completeInOrder')}
          </p>
        </div>
        <Badge 
          variant="outline" 
          className="bg-fitness-primary-50 border-fitness-primary-200 text-fitness-primary-700 font-medium px-3 py-1"
        >
          {exercises.filter(ex => ex.completed).length}/{exercises.length} {t('exercise.completed')}
        </Badge>
      </div>

      {/* Enhanced Exercise List */}
      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <Card 
            key={exercise.id} 
            className={`transition-all duration-300 border-2 ${
              exercise.completed 
                ? "bg-success-50 border-success-200 shadow-lg" 
                : "bg-white border-gray-200 hover:border-fitness-primary-300 hover:shadow-lg"
            }`}
          >
            <div className="p-6">
              {/* Exercise Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Exercise Number & Status */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    exercise.completed 
                      ? "bg-success-500 text-white" 
                      : "bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 text-white"
                  }`}>
                    {exercise.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Exercise Info */}
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold mb-2 ${
                      exercise.completed ? "text-success-800" : "text-gray-900"
                    }`}>
                      {exercise.name}
                    </h3>
                    
                    {/* Exercise Details */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {exercise.sets && exercise.reps && (
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4 text-fitness-primary-500" />
                          <span className="font-medium text-gray-700">
                            {exercise.sets} x {exercise.reps}
                          </span>
                        </div>
                      )}
                      
                      {exercise.rest_seconds && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-fitness-orange-500" />
                          <span className="font-medium text-gray-700">
                            {Math.floor(exercise.rest_seconds / 60)}:{(exercise.rest_seconds % 60).toString().padStart(2, '0')} {t('exercise.rest')}
                          </span>
                        </div>
                      )}

                      {exercise.equipment && (
                        <Badge variant="outline" className="bg-fitness-accent-50 border-fitness-accent-200 text-fitness-accent-700">
                          {exercise.equipment}
                        </Badge>
                      )}

                      {exercise.difficulty && (
                        <Badge 
                          variant="outline" 
                          className={`${
                            exercise.difficulty === 'beginner' 
                              ? "bg-success-50 border-success-200 text-success-700"
                              : exercise.difficulty === 'intermediate'
                              ? "bg-fitness-orange-50 border-fitness-orange-200 text-fitness-orange-700"
                              : "bg-error-50 border-error-200 text-error-700"
                          }`}
                        >
                          {exercise.difficulty}
                        </Badge>
                      )}
                    </div>

                    {/* Muscle Groups */}
                    {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {exercise.muscle_groups.map((muscle, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="bg-fitness-secondary-50 border-fitness-secondary-200 text-fitness-secondary-700 text-xs"
                          >
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedExercise(
                      expandedExercise === exercise.id ? null : exercise.id
                    )}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedExercise === exercise.id && (
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
                  {/* Instructions */}
                  {exercise.instructions && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {t('exercise.instructions')}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {exercise.instructions}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => onExerciseComplete(exercise.id)}
                      disabled={exercise.completed}
                      variant={exercise.completed ? "secondary" : "success"}
                      size="lg"
                      className="font-semibold"
                    >
                      {exercise.completed ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {t('exercise.completed')}
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          {t('exercise.markComplete')}
                        </>
                      )}
                    </Button>

                    {exercise.youtube_search_term && (
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                        onClick={() => 
                          window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.youtube_search_term)}`, '_blank')
                        }
                      >
                        <Youtube className="w-4 h-4 mr-2" />
                        {t('exercise.watchDemo')}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExerciseList;

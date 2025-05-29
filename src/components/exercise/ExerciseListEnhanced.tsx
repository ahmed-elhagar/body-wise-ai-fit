
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dumbbell, Clock, Target, Youtube, Play, CheckCircle, Check, Edit3, Save, X, Coffee } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseListEnhancedProps {
  exercises: any[];
  isLoading: boolean;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isRestDay?: boolean;
}

export const ExerciseListEnhanced = ({ 
  exercises, 
  isLoading, 
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay = false
}: ExerciseListEnhancedProps) => {
  const { t } = useLanguage();
  const [editingExercise, setEditingExercise] = useState<string | null>(null);
  const [editData, setEditData] = useState({ sets: 0, reps: '', notes: '' });

  const handleStartEdit = (exercise: any) => {
    setEditingExercise(exercise.id);
    setEditData({
      sets: exercise.actual_sets || exercise.sets || 0,
      reps: exercise.actual_reps || exercise.reps || '',
      notes: exercise.notes || ''
    });
  };

  const handleSaveProgress = (exerciseId: string) => {
    onExerciseProgressUpdate(exerciseId, editData.sets, editData.reps, editData.notes);
    setEditingExercise(null);
  };

  if (isLoading) {
    return (
      <div className="lg:col-span-3">
        <div className="text-center py-8">
          <div className="w-8 h-8 animate-spin border-4 border-fitness-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-600">{t('exercise.loadingExercises') || 'Loading exercises...'}</p>
        </div>
      </div>
    );
  }

  // Rest Day Display
  if (isRestDay) {
    return (
      <div className="lg:col-span-3">
        <Card className="p-8 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg text-center">
          <Coffee className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-orange-800 mb-3">
            {t('exercise.restDay') || 'Rest Day'}
          </h3>
          <p className="text-orange-700 mb-4">
            {t('exercise.restDayDescription') || 'Your muscles need time to recover and grow stronger. Use this day to:'}
          </p>
          <ul className="text-left text-orange-700 space-y-2 max-w-md mx-auto">
            <li>• {t('exercise.restTip1') || 'Get adequate sleep (7-9 hours)'}</li>
            <li>• {t('exercise.restTip2') || 'Stay hydrated throughout the day'}</li>
            <li>• {t('exercise.restTip3') || 'Do light stretching or yoga'}</li>
            <li>• {t('exercise.restTip4') || 'Focus on nutrition and meal prep'}</li>
            <li>• {t('exercise.restTip5') || 'Take a relaxing walk outdoors'}</li>
          </ul>
        </Card>
      </div>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="lg:col-span-3">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
          <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {t('exercise.noExercises') || 'No Exercises for Today'}
          </h3>
          <p className="text-gray-600">
            {t('exercise.noExercisesMessage') || 'Generate an AI workout plan to get started'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {t('exercise.exerciseList') || 'Exercise List'}
        </h2>
        <Badge variant="outline" className="bg-white/80">
          {exercises.length} {t('exercise.exercises') || 'exercises'}
        </Badge>
      </div>
      
      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <Card 
            key={exercise.id}
            className={`p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
              exercise.completed ? 'bg-green-50/80 border-green-200' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  exercise.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {exercise.completed ? <CheckCircle className="w-5 h-5" /> : exercise.order_number || index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {exercise.name}
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="font-medium">
                      {exercise.actual_sets || exercise.sets} sets × {exercise.actual_reps || exercise.reps} reps
                    </span>
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
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {exercise.equipment || 'Bodyweight'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {exercise.difficulty || 'Beginner'}
                    </Badge>
                  </div>
                  
                  {exercise.instructions && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{exercise.instructions}</p>
                  )}

                  {/* Editing Form */}
                  {editingExercise === exercise.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-700">Sets</label>
                          <Input
                            type="number"
                            value={editData.sets}
                            onChange={(e) => setEditData(prev => ({ ...prev, sets: parseInt(e.target.value) || 0 }))}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700">Reps</label>
                          <Input
                            value={editData.reps}
                            onChange={(e) => setEditData(prev => ({ ...prev, reps: e.target.value }))}
                            placeholder="e.g., 12 or 8-12"
                            className="h-8"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700">Notes</label>
                        <Textarea
                          value={editData.notes}
                          onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Add notes about your performance..."
                          className="h-16 text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {exercise.notes && !editingExercise && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">{exercise.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-4 flex-shrink-0">
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
                
                {editingExercise === exercise.id ? (
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => handleSaveProgress(exercise.id)}
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingExercise(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : exercise.completed ? (
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white whitespace-nowrap"
                    disabled
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Completed
                  </Button>
                ) : (
                  <div className="flex flex-col space-y-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/80 whitespace-nowrap"
                      onClick={() => handleStartEdit(exercise)}
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Track
                    </Button>
                    <Button
                      size="sm"
                      className="bg-fitness-gradient hover:opacity-90 text-white whitespace-nowrap"
                      onClick={() => onExerciseComplete(exercise.id)}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Complete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const handleStartEdit = (exercise: any) => {
  setEditingExercise(exercise.id);
  setEditData({
    sets: exercise.actual_sets || exercise.sets || 0,
    reps: exercise.actual_reps || exercise.reps || '',
    notes: exercise.notes || ''
  });
};

const handleSaveProgress = (exerciseId: string) => {
  onExerciseProgressUpdate(exerciseId, editData.sets, editData.reps, editData.notes);
  setEditingExercise(null);
};

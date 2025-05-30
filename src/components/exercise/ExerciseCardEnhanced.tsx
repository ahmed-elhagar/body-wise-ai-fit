
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Dumbbell, Play, Youtube, Edit3, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExerciseProgressDialog } from "./ExerciseProgressDialog";
import { ExerciseExchangeDialog } from "./ExerciseExchangeDialog";
import { translateExerciseContent } from "@/utils/exerciseTranslationUtils";

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
  const { t, language } = useLanguage();
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);

  // Translate exercise content based on current language
  const translatedExercise = translateExerciseContent(exercise, language);

  // Debug log to track translation
  useEffect(() => {
    console.log('🎯 ExerciseCardEnhanced - Translation Debug:', {
      originalName: exercise.name,
      translatedName: translatedExercise.name,
      currentLanguage: language,
      exerciseId: exercise.id
    });
  }, [exercise.name, translatedExercise.name, language, exercise.id]);

  const handleWatchVideo = () => {
    const searchQuery = translatedExercise.youtube_search_term || translatedExercise.name;
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    window.open(youtubeUrl, '_blank');
  };

  const progressPercentage = exercise.completed ? 100 : 0;

  return (
    <>
      <Card className={`p-6 transition-all duration-300 border-2 ${
        exercise.completed 
          ? 'bg-green-50 border-green-200 shadow-md' 
          : 'bg-white border-health-border hover:border-health-primary hover:shadow-lg'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
              exercise.completed ? 'bg-green-500' : 'bg-health-primary'
            }`}>
              {exercise.completed ? <CheckCircle className="w-5 h-5" /> : index + 1}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-health-text-primary mb-1">
                {translatedExercise.name}
              </h3>
              <div className="flex items-center gap-3 text-sm text-health-text-secondary">
                <span className="flex items-center gap-1">
                  <Dumbbell className="w-4 h-4" />
                  {exercise.sets} {t('exercise.sets')} × {exercise.reps} {t('exercise.reps')}
                </span>
                {exercise.rest_seconds && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {exercise.rest_seconds}s {t('exercise.rest')}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {exercise.completed && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                {t('exercise.completed')}
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-health-text-secondary">
              {t('exercise.progress')}
            </span>
            <span className="text-sm font-medium text-health-primary">
              {progressPercentage}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Exercise Details */}
        {translatedExercise.instructions && (
          <div className="mb-4 p-3 bg-health-soft rounded-lg">
            <p className="text-sm text-health-text-secondary leading-relaxed">
              {translatedExercise.instructions}
            </p>
          </div>
        )}

        {/* Muscle Groups & Equipment */}
        <div className="flex flex-wrap gap-2 mb-4">
          {exercise.muscle_groups?.map((muscle: string, idx: number) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {t(`exercise.${muscle}`) || muscle}
            </Badge>
          ))}
          {exercise.equipment && (
            <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
              {t(`exercise.${exercise.equipment}`) || exercise.equipment}
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {!exercise.completed ? (
            <>
              <Button
                onClick={() => onExerciseComplete(exercise.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {t('exercise.markComplete')}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowProgressDialog(true)}
                className="border-health-border hover:bg-health-soft"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {t('exercise.editProgress')}
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowProgressDialog(true)}
              className="flex-1 border-green-200 hover:bg-green-50 text-green-700"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {t('exercise.editProgress')}
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={handleWatchVideo}
            className="border-red-200 hover:bg-red-50 text-red-600"
          >
            <Youtube className="w-4 h-4 mr-2" />
            {t('exercise.watchVideo')}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowExchangeDialog(true)}
            className="border-orange-200 hover:bg-orange-50 text-orange-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('exercise.exchange')}
          </Button>
        </div>
      </Card>

      <ExerciseProgressDialog
        exercise={exercise}
        open={showProgressDialog}
        onOpenChange={setShowProgressDialog}
        onSave={(sets, reps, notes) => {
          onExerciseProgressUpdate(exercise.id, sets, reps, notes);
          setShowProgressDialog(false);
        }}
      />

      <ExerciseExchangeDialog
        exercise={exercise}
        open={showExchangeDialog}
        onOpenChange={setShowExchangeDialog}
      />
    </>
  );
};

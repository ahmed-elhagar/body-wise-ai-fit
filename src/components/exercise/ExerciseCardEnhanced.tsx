import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play, Youtube, MoreHorizontal } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import type { Exercise } from "@/types/exercise";

interface ExerciseCardEnhancedProps {
  exercise: Exercise;
  index: number;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
}

export const ExerciseCardEnhanced = ({ exercise, index, onExerciseComplete, onExerciseProgressUpdate }: ExerciseCardEnhancedProps) => {
  const { t, isRTL } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const [sets, setSets] = useState(exercise.sets || 3);
  const [reps, setReps] = useState(exercise.reps || '12');
  const [notes, setNotes] = useState(exercise.notes || '');

  const handleComplete = () => {
    onExerciseComplete(exercise.id);
  };

  const handleProgressUpdate = () => {
    onExerciseProgressUpdate(exercise.id, sets, reps, notes);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="group relative overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
      {/* Completed Badge */}
      {exercise.completed && (
        <Badge className="absolute top-3 right-3 bg-green-500 text-white z-10">
          {t('exercise.completed')}
        </Badge>
      )}

      {/* Main Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {index + 1}. {exercise.exercise_name}
          </h3>
          <Button variant="ghost" size="sm" onClick={toggleExpand}>
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </Button>
        </div>

        {/* Exercise Details */}
        <div className="text-sm text-gray-600">
          {t('exercise.sets')}: {sets}, {t('exercise.reps')}: {reps}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleComplete}
            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {t('exercise.complete')}
          </Button>
          {exercise.youtube_url && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open(exercise.youtube_url, '_blank')}
              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
            >
              <Youtube className="w-4 h-4 mr-2" />
              {t('exercise.youtube')}
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Content (Initially Hidden) */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          <div className="space-y-3">
            {/* Sets and Reps Input */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('exercise.sets')}</label>
                <input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('exercise.reps')}</label>
                <input
                  type="text"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('exercise.notes')}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>

            {/* Save Progress Button */}
            <Button
              onClick={handleProgressUpdate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              {t('exercise.saveProgress')}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

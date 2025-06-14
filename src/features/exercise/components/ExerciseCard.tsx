
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play, MoreVertical } from "lucide-react";
import { Exercise } from '../types';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExerciseCardProps {
  exercise: Exercise;
  onComplete: (exerciseId: string) => Promise<void>;
  onProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  isActive: boolean;
  onSetActive: () => void;
}

export const ExerciseCard = ({
  exercise,
  onComplete,
  onProgressUpdate,
  isActive,
  onSetActive
}: ExerciseCardProps) => {
  const { t } = useLanguage();

  const handleComplete = async () => {
    try {
      await onComplete(exercise.id);
    } catch (error) {
      console.error('Error completing exercise:', error);
    }
  };

  return (
    <Card className={`p-4 transition-all duration-200 ${isActive ? 'ring-2 ring-fitness-primary-400 shadow-lg' : 'hover:shadow-md'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
          {exercise.completed && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              {t('exercise.completed')}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-600">{t('exercise.sets')}:</span>
          <span className="ml-1 font-medium">{exercise.sets || 3}</span>
        </div>
        <div>
          <span className="text-gray-600">{t('exercise.reps')}:</span>
          <span className="ml-1 font-medium">{exercise.reps || '10'}</span>
        </div>
        <div>
          <span className="text-gray-600">{t('exercise.rest')}:</span>
          <span className="ml-1 font-medium">{exercise.rest_seconds || 60}s</span>
        </div>
      </div>

      <div className="flex gap-2">
        {!exercise.completed && (
          <Button
            onClick={onSetActive}
            variant={isActive ? "default" : "outline"}
            size="sm"
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            {isActive ? t('exercise.active') : t('exercise.start')}
          </Button>
        )}
        
        <Button
          onClick={handleComplete}
          variant={exercise.completed ? "secondary" : "default"}
          size="sm"
          className="flex-1"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {exercise.completed ? t('exercise.completed') : t('exercise.markComplete')}
        </Button>
      </div>
    </Card>
  );
};

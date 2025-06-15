
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Trophy, Target, Moon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseProgressSectionProps {
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isRestDay: boolean;
  selectedDayNumber: number;
  currentProgram?: any;
}

export const ExerciseProgressSection = ({
  completedExercises,
  totalExercises,
  progressPercentage,
  isRestDay,
  selectedDayNumber,
  currentProgram
}: ExerciseProgressSectionProps) => {
  const { t, isRTL } = useLanguage();

  if (isRestDay) {
    return (
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Moon className="w-5 h-5 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h3 className="font-bold text-blue-900">{t('exercise.restDay')}</h3>
              <p className="text-sm text-blue-700">{t('exercise.recoveryTime')}</p>
            </div>
          </div>
          <Badge className="bg-blue-500 text-white">
            {t('exercise.day')} {selectedDayNumber}
          </Badge>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <div className="space-y-3">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h3 className="font-bold text-green-900">
                {t('exercise.day')} {selectedDayNumber} {t('exercise.progress')}
              </h3>
              <p className="text-sm text-green-700">
                {completedExercises} {t('exercise.of')} {totalExercises} {t('exercise.completed')}
              </p>
            </div>
          </div>
          <Badge className={`${progressPercentage === 100 ? 'bg-green-500' : 'bg-orange-500'} text-white`}>
            {Math.round(progressPercentage)}%
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className={`flex justify-between text-xs text-green-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span>{t('exercise.progress')}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-green-100" />
        </div>

        {/* Program Info */}
        {currentProgram && (
          <div className={`flex items-center gap-4 text-xs text-green-600 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {currentProgram.goal_type?.replace('_', ' ') || t('exercise.general_fitness')}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {currentProgram.difficulty_level || t('exercise.beginner')}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

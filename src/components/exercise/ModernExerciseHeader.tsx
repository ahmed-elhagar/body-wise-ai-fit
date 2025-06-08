
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Sparkles, RefreshCw } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ModernExerciseHeaderProps {
  title: string;
  workoutType: 'home' | 'gym';
  currentWeek: number;
  onRegenerateProgram?: () => void;
  onCustomizeProgram?: () => void;
  isGenerating?: boolean;
}

const ModernExerciseHeader = ({
  title,
  workoutType,
  currentWeek,
  onRegenerateProgram,
  onCustomizeProgram,
  isGenerating = false
}: ModernExerciseHeaderProps) => {
  const { t, isRTL } = useI18n();

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600">
              {t('exercise:week')} {currentWeek} • {workoutType === 'home' ? t('exercise:home') : t('exercise:gym')} {t('exercise:workout')}
            </p>
          </div>
        </div>

        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {onCustomizeProgram && (
            <Button
              onClick={onCustomizeProgram}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t('exercise:customize')}
            </Button>
          )}
          
          {onRegenerateProgram && (
            <Button
              onClick={onRegenerateProgram}
              disabled={isGenerating}
              variant="outline"
              className="bg-white/80"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('exercise:regenerate')}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ModernExerciseHeader;

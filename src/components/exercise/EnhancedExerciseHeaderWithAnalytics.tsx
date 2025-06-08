
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  BarChart3, 
  Brain, 
  Trophy, 
  Award,
  TrendingUp,
  Target,
  Zap,
  Calendar
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface EnhancedExerciseHeaderWithAnalyticsProps {
  currentProgram: any;
  onShowAnalytics: () => void;
  onShowAIDialog: () => void;
  onRegenerateProgram: () => void;
  isGenerating: boolean;
  workoutType: "home" | "gym";
}

export const EnhancedExerciseHeaderWithAnalytics = ({
  currentProgram,
  onShowAnalytics,
  onShowAIDialog,
  onRegenerateProgram,
  isGenerating,
  workoutType
}: EnhancedExerciseHeaderWithAnalyticsProps) => {
  const { t } = useLanguage();

  // Mock analytics summary data
  const analyticsData = {
    totalWorkouts: 28,
    personalRecords: 5,
    weekStreak: 3,
    thisWeekProgress: 75
  };

  return (
    <div className="space-y-4">
      {/* Program Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentProgram?.program_name || t('Exercise Program')}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="outline" className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {workoutType === 'home' ? t('Home Workout') : t('Gym Workout')}
            </Badge>
            {currentProgram?.difficulty_level && (
              <Badge variant="secondary">
                {currentProgram.difficulty_level}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onShowAnalytics}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            {t('Analytics')}
          </Button>
          <Button
            variant="outline"
            onClick={onRegenerateProgram}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            {isGenerating ? t('Generating...') : t('AI Regenerate')}
          </Button>
          <Button onClick={onShowAIDialog} className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {t('New Program')}
          </Button>
        </div>
      </div>

      {/* Quick Analytics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-lg font-bold text-blue-900">{analyticsData.totalWorkouts}</div>
              <div className="text-xs text-blue-700">{t('Total Workouts')}</div>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <div>
              <div className="text-lg font-bold text-yellow-900">{analyticsData.personalRecords}</div>
              <div className="text-xs text-yellow-700">{t('Personal Records')}</div>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-green-50 border-green-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <div>
              <div className="text-lg font-bold text-green-900">{analyticsData.weekStreak}</div>
              <div className="text-xs text-green-700">{t('Week Streak')}</div>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            <div>
              <div className="text-lg font-bold text-purple-900">{analyticsData.thisWeekProgress}%</div>
              <div className="text-xs text-purple-700">{t('This Week')}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};


import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Loader2,
  Home,
  Building
} from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';

interface ExerciseHeaderProps {
  activeTab: string;
  currentWeekOffset: number;
  currentProgram?: any;
  todaysExercises: any[];
  selectedDayNumber: number;
  workoutType: "home" | "gym";
  creditsRemaining: number;
  isPro: boolean;
  hasProgram: boolean;
  onWeekOffsetChange: (offset: number) => void;
  onWorkoutTypeChange: (type: "home" | "gym") => void;
  onShowAIModal: () => void;
  onRegenerateProgram: () => void;
  isGenerating: boolean;
}

export const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
  activeTab,
  currentWeekOffset,
  currentProgram,
  todaysExercises,
  selectedDayNumber,
  workoutType,
  creditsRemaining,
  isPro,
  hasProgram,
  onWeekOffsetChange,
  onWorkoutTypeChange,
  onShowAIModal,
  onRegenerateProgram,
  isGenerating
}) => {
  const getWeekStartDate = (offset: number = 0) => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    return addDays(startOfCurrentWeek, offset * 7);
  };

  const formatWeekRange = (startDate: Date) => {
    const endDate = addDays(startDate, 6);
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  };

  const weekStartDate = getWeekStartDate(currentWeekOffset);

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Exercise Program</h1>
          <div className="flex items-center space-x-3">
            <p className="text-gray-600">
              {formatWeekRange(weekStartDate)} • {currentProgram ? 'AI Generated Program' : 'No Program Available'}
            </p>
            <div className="flex items-center space-x-2">
              {workoutType === 'home' ? <Home className="h-4 w-4 text-gray-500" /> : <Building className="h-4 w-4 text-gray-500" />}
              <span className="text-sm text-gray-600 capitalize">{workoutType} Workout</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekOffsetChange(currentWeekOffset - 1)}
            className="border-gray-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600 px-3 font-medium">
            Week {currentWeekOffset === 0 ? 'Current' : currentWeekOffset > 0 ? `+${currentWeekOffset}` : currentWeekOffset}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekOffsetChange(currentWeekOffset + 1)}
            className="border-gray-300"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <div className="ml-4">
            {hasProgram ? (
              <Button 
                onClick={onRegenerateProgram}
                disabled={isGenerating}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Regenerate Program
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={onShowAIModal}
                disabled={!isPro && creditsRemaining <= 0}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Program
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

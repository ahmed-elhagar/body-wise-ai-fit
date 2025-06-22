import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, Target } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ExerciseProgram } from '../../types';

interface WorkoutCalendarProps {
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentProgram?: ExerciseProgram;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
}

export const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({
  selectedDayNumber,
  setSelectedDayNumber,
  currentProgram,
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate
}) => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handlePreviousWeek = () => {
    setCurrentWeekOffset(currentWeekOffset - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeekOffset(currentWeekOffset + 1);
  };

  const getWeekLabel = () => {
    if (currentWeekOffset === 0) return 'Current Week';
    if (currentWeekOffset > 0) return `Week +${currentWeekOffset}`;
    return `Week ${currentWeekOffset}`;
  };

  const getDayButtonClasses = (isSelected: boolean, isCurrentDay: boolean) => {
    const baseClasses = "p-4 rounded-xl text-center transition-all duration-300 ease-in-out hover:transform hover:scale-105 relative";
    
    if (isSelected) {
      return `${baseClasses} bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border-2 border-indigo-500 transform scale-105 font-semibold`;
    }
    
    if (isCurrentDay) {
      return `${baseClasses} bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-700 border-2 border-indigo-300 font-semibold shadow-sm`;
    }
    
    return `${baseClasses} bg-white text-gray-600 hover:bg-gradient-to-br hover:from-gray-50 hover:to-indigo-50 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md`;
  };

  const getExerciseIndicatorClasses = (isSelected: boolean, isCurrentDay: boolean) => {
    if (isSelected) {
      return 'bg-white shadow-sm';
    }
    if (isCurrentDay) {
      return 'bg-indigo-600';
    }
    return 'bg-indigo-500';
  };

  return (
    <Card className="p-6 mb-6 bg-gradient-to-br from-white via-gray-50/30 to-indigo-50/20 border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">Weekly Schedule</h3>
            <p className="text-sm text-gray-600">Select a day to view exercises</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePreviousWeek}
            className="hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium text-gray-700 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 min-w-[120px] text-center shadow-sm">
            {getWeekLabel()}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextWeek}
            className="hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-3">
        {weekDays.map((day, index) => {
          const dayNumber = index + 1;
          const isSelected = selectedDayNumber === dayNumber;
          const dayDate = addDays(weekStartDate, index);
          const isCurrentDay = format(dayDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          
          // Check if this day has exercises
          const hasExercises = currentProgram?.daily_workouts?.some(
            workout => workout.day_number === dayNumber && 
            workout.exercises && 
            workout.exercises.length > 0
          );

          const exerciseCount = currentProgram?.daily_workouts?.find(
            workout => workout.day_number === dayNumber
          )?.exercises?.length || 0;
          
          return (
            <button
              key={day}
              onClick={() => setSelectedDayNumber(dayNumber)}
              className={getDayButtonClasses(isSelected, isCurrentDay)}
            >
              {/* Day Label */}
              <div className="text-xs font-medium uppercase tracking-wider opacity-75 mb-1">
                {day}
              </div>
              
              {/* Date */}
              <div className="text-xl font-bold mb-2">
                {format(dayDate, 'd')}
              </div>
              
              {/* Exercise Indicator */}
              <div className="flex items-center justify-center space-x-1">
                {hasExercises ? (
                  <>
                    <div className={`w-2 h-2 rounded-full ${getExerciseIndicatorClasses(isSelected, isCurrentDay)}`}></div>
                    {exerciseCount > 1 && (
                      <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-indigo-600'}`}>
                        {exerciseCount}
                      </span>
                    )}
                  </>
                ) : isCurrentDay && !isSelected ? (
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                ) : null}
              </div>

              {/* Rest Day Indicator */}
              {!hasExercises && !isCurrentDay && (
                <div className="text-xs text-gray-400 mt-1">Rest</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Week Summary */}
      <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-indigo-600" />
            <span className="text-gray-700">This week:</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-indigo-600 font-medium">
              {currentProgram?.daily_workouts?.filter(w => w.exercises && w.exercises.length > 0).length || 0} workout days
            </span>
            <span className="text-purple-600 font-medium">
              {currentProgram?.daily_workouts?.reduce((total, w) => total + (w.exercises?.length || 0), 0) || 0} exercises
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
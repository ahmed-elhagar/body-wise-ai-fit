
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, RotateCcw, Target, TrendingUp } from "lucide-react";
import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface WeeklyExerciseNavigationProps {
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
}

export const WeeklyExerciseNavigation = ({
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate
}: WeeklyExerciseNavigationProps) => {
  const { t } = useLanguage();

  const formatWeekRange = (startDate: Date) => {
    const endDate = addDays(startDate, 6);
    const startMonth = format(startDate, 'MMM');
    const startDay = format(startDate, 'd');
    const endMonth = format(endDate, 'MMM');
    const endDay = format(endDate, 'd');
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
  };

  const goToCurrentWeek = () => {
    setCurrentWeekOffset(0);
  };

  const year = format(weekStartDate, 'yyyy');

  return (
    <Card className="p-6 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 border-0 shadow-xl backdrop-blur-sm rounded-3xl">
      <div className="space-y-6">
        {/* Main Navigation Header */}
        <div className="flex items-center justify-between">
          {/* Left Navigation */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentWeekOffset(Math.max(0, currentWeekOffset - 1))}
            disabled={currentWeekOffset === 0}
            className="h-12 w-12 p-0 rounded-2xl hover:bg-gray-100 disabled:opacity-50 transition-all duration-300 hover:scale-110 shadow-md bg-white/80"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Center - Week Info */}
          <div className="text-center flex-1 space-y-3">
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Week {currentWeekOffset + 1}
                </h2>
                <p className="text-gray-600 font-medium text-lg">
                  {formatWeekRange(weekStartDate)}, {year}
                </p>
              </div>
            </div>

            {/* Enhanced Week Status */}
            <div className="flex items-center justify-center gap-3">
              {currentWeekOffset === 0 ? (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                  Current Week
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 px-4 py-2 text-sm font-medium rounded-full shadow-sm">
                  <Target className="w-3 h-3 mr-2" />
                  Week {currentWeekOffset + 1} of Program
                </Badge>
              )}
            </div>
          </div>

          {/* Right Navigation */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
            disabled={currentWeekOffset >= 3} // 4-week program limit
            className="h-12 w-12 p-0 rounded-2xl hover:bg-gray-100 disabled:opacity-50 transition-all duration-300 hover:scale-110 shadow-md bg-white/80"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Enhanced Progress Indicators */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((week) => (
            <div
              key={week}
              className={`h-2 w-8 rounded-full transition-all duration-300 ${
                week <= currentWeekOffset + 1
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-md'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Program Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white/60 rounded-xl backdrop-blur-sm border border-white/50">
            <div className="text-xl font-bold text-blue-600">{currentWeekOffset + 1}</div>
            <div className="text-xs text-gray-600 font-medium">Current Week</div>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-xl backdrop-blur-sm border border-white/50">
            <div className="text-xl font-bold text-purple-600">4</div>
            <div className="text-xs text-gray-600 font-medium">Total Weeks</div>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-xl backdrop-blur-sm border border-white/50">
            <div className="text-xl font-bold text-green-600">{Math.round(((currentWeekOffset + 1) / 4) * 100)}%</div>
            <div className="text-xs text-gray-600 font-medium">Complete</div>
          </div>
        </div>

        {/* Quick Actions */}
        {currentWeekOffset > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={goToCurrentWeek}
                className="bg-white/80 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl px-6 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 shadow-sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Back to Current Week
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

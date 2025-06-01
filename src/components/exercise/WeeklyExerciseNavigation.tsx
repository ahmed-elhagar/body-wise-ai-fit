
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, RotateCcw } from "lucide-react";
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
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl">
      <div className="flex items-center justify-between">
        {/* Navigation Controls */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentWeekOffset(Math.max(0, currentWeekOffset - 1))}
          disabled={currentWeekOffset === 0}
          className="h-10 w-10 p-0 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-all duration-300 hover:scale-105"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        {/* Week Info */}
        <div className="text-center flex-1 space-y-2">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Week {currentWeekOffset + 1}
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                {formatWeekRange(weekStartDate)}, {year}
              </p>
            </div>
          </div>

          {/* Week Status */}
          <div className="flex items-center justify-center gap-2">
            {currentWeekOffset === 0 ? (
              <Badge 
                variant="secondary" 
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1 text-xs font-semibold shadow-md"
              >
                Current Week
              </Badge>
            ) : (
              <Badge 
                variant="outline" 
                className="bg-blue-50 border-blue-200 text-blue-700 px-3 py-1 text-xs font-medium"
              >
                Week {currentWeekOffset + 1} of Program
              </Badge>
            )}
          </div>
        </div>

        {/* Forward Navigation */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
          disabled={currentWeekOffset >= 3} // 4-week program limit
          className="h-10 w-10 p-0 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-all duration-300 hover:scale-105"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Quick Actions */}
      {currentWeekOffset > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={goToCurrentWeek}
              className="bg-white/80 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl px-4 py-2 text-xs font-medium transition-all duration-300 hover:scale-105"
            >
              <RotateCcw className="w-3 h-3 mr-2" />
              Back to Current Week
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

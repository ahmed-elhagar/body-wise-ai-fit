import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Sparkles, RotateCcw, Calendar } from "lucide-react";
import { format, addDays } from "date-fns";
import { useMealPlanTranslation } from "@/utils/translationHelpers";

interface WeeklyPlanHeaderProps {
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  onOpenAIDialog: () => void;
  onRegeneratePlan: () => void;
  isGenerating: boolean;
  weekStartDate: Date;
}

const WeeklyPlanHeader = ({
  currentWeekOffset,
  onWeekChange,
  onOpenAIDialog,
  onRegeneratePlan,
  isGenerating,
  weekStartDate
}: WeeklyPlanHeaderProps) => {
  const { mealPlanT } = useMealPlanTranslation();

  const weekEndDate = addDays(weekStartDate, 6);
  const isCurrentWeek = currentWeekOffset === 0;
  const isFutureWeek = currentWeekOffset > 0;

  return (
    <Card className="bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200 shadow-lg">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Week Navigation & Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onWeekChange(currentWeekOffset - 1)}
                className="border-fitness-primary-300 text-fitness-primary-600 hover:bg-fitness-primary-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-center min-w-0 flex-1">
                <div className="flex items-center gap-2 justify-center">
                  <Calendar className="w-5 h-5 text-fitness-primary-600" />
                  <h1 className="text-xl lg:text-2xl font-bold text-fitness-primary-700">
                    {format(weekStartDate, 'MMM d')} - {format(weekEndDate, 'MMM d, yyyy')}
                  </h1>
                </div>
                <div className="flex items-center gap-2 justify-center mt-1">
                  {isCurrentWeek && (
                    <Badge className="bg-fitness-accent-100 text-fitness-accent-700 border-fitness-accent-200 font-medium">
                      📅 {mealPlanT('currentWeek')}
                    </Badge>
                  )}
                  {isFutureWeek && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 font-medium">
                      🔮 {mealPlanT('futureWeek')}
                    </Badge>
                  )}
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onWeekChange(currentWeekOffset + 1)}
                className="border-fitness-primary-300 text-fitness-primary-600 hover:bg-fitness-primary-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
            <Button
              onClick={onRegeneratePlan}
              disabled={isGenerating}
              variant="outline"
              size="sm"
              className="border-fitness-primary-300 bg-white text-fitness-primary-600 hover:bg-fitness-primary-50 hover:text-fitness-primary-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {mealPlanT('regenerate')}
            </Button>
            
            <Button
              onClick={onOpenAIDialog}
              disabled={isGenerating}
              size="sm"
              className="bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white hover:from-fitness-primary-600 hover:to-fitness-primary-700 shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {mealPlanT('generateNewPlan')}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeeklyPlanHeader;

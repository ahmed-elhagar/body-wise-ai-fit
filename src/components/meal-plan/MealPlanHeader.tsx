
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Shuffle, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays } from "date-fns";
import { useMealPlanTranslation } from "@/utils/translationHelpers";

interface MealPlanHeaderProps {
  weekStartDate: Date;
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  onGenerateAI: () => void;
  onShuffle: () => void;
  isGenerating: boolean;
  hasWeeklyPlan: boolean;
}

const MealPlanHeader = ({
  weekStartDate,
  currentWeekOffset,
  onWeekChange,
  onGenerateAI,
  onShuffle,
  isGenerating,
  hasWeeklyPlan
}: MealPlanHeaderProps) => {
  const { mealPlanT } = useMealPlanTranslation();
  const isCurrentWeek = currentWeekOffset === 0;
  const weekEndDate = addDays(weekStartDate, 6);

  return (
    <Card className="bg-gradient-to-r from-fitness-primary-50 via-white to-fitness-accent-50 border-fitness-primary-200 shadow-lg">
      <div className="p-6">
        <div className="flex items-center justify-between">
          {/* Week Navigation */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onWeekChange(currentWeekOffset - 1)}
                className="h-10 w-10 p-0 border-fitness-primary-300 text-fitness-primary-600 hover:bg-fitness-primary-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-center min-w-0">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-fitness-primary-700">
                    {mealPlanT('title')}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-fitness-primary-600">
                      {format(weekStartDate, 'MMM d')} - {format(weekEndDate, 'MMM d')}
                    </span>
                    {isCurrentWeek && (
                      <Badge className="bg-fitness-accent-100 text-fitness-accent-700 border-fitness-accent-200">
                        {mealPlanT('currentWeek')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onWeekChange(currentWeekOffset + 1)}
                className="h-10 w-10 p-0 border-fitness-primary-300 text-fitness-primary-600 hover:bg-fitness-primary-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {hasWeeklyPlan && (
              <Button
                onClick={onShuffle}
                disabled={isGenerating}
                variant="outline"
                className="border-fitness-accent-300 text-fitness-accent-600 hover:bg-fitness-accent-50"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                {mealPlanT('shuffleMeals')}
              </Button>
            )}
            
            <Button
              onClick={onGenerateAI}
              disabled={isGenerating}
              className="bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white hover:from-fitness-primary-600 hover:to-fitness-primary-700 shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {hasWeeklyPlan ? mealPlanT('regenerate') : mealPlanT('generateAIMealPlan')}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MealPlanHeader;

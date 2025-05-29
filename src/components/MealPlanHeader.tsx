
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Sparkles, RotateCcw, Utensils, Shuffle, TrendingUp } from "lucide-react";

interface MealPlanHeaderProps {
  currentDate: string;
  currentDay: string;
  onShowAIDialog: () => void;
  onRegeneratePlan: () => void;
  isGenerating: boolean;
  isShuffling?: boolean;
  dietType?: string;
  totalWeeklyCalories?: number;
}

const MealPlanHeader = ({ 
  currentDate, 
  currentDay, 
  onShowAIDialog, 
  onRegeneratePlan, 
  isGenerating,
  isShuffling = false,
  dietType,
  totalWeeklyCalories
}: MealPlanHeaderProps) => {
  const getDietTypeColor = (diet: string) => {
    switch (diet) {
      case 'Vegetarian': return 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border-green-200';
      case 'Keto': return 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-200';
      case 'High Protein': return 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200';
      case 'Low Carb': return 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gradient-to-r from-health-soft to-white text-health-text-primary border-health-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Diet Type Highlight Card */}
      {dietType && (
        <Card className="p-6 bg-gradient-to-br from-health-primary/10 via-health-secondary/5 to-white border-2 border-health-border-light shadow-health rounded-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-health-gradient rounded-xl flex items-center justify-center shadow-health">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-health-text-primary mb-1">Your Meal Plan</h3>
                <p className="text-health-text-secondary font-medium">Personalized nutrition for your fitness goals</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={`${getDietTypeColor(dietType)} font-bold px-4 py-2 text-sm rounded-xl border-2 shadow-soft`}>
                {dietType} Diet
              </Badge>
              {totalWeeklyCalories && (
                <Badge className="bg-gradient-to-r from-health-info/10 to-health-info/5 text-health-info border-2 border-health-info/20 font-semibold px-4 py-2 rounded-xl shadow-soft">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {Math.round(totalWeeklyCalories / 7)} cal/day
                </Badge>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Enhanced Main Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold bg-health-gradient bg-clip-text text-transparent">
            Meal Plan
          </h1>
          <div className="flex items-center text-health-text-secondary bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-health-border-light shadow-soft">
            <Calendar className="w-5 h-5 mr-3 text-health-primary" />
            <span className="font-medium">{currentDay}, {currentDate}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Enhanced SHUFFLE Button */}
          <Button
            onClick={onRegeneratePlan}
            variant="outline"
            disabled={isGenerating || isShuffling}
            className="bg-white/90 hover:bg-health-soft-blue border-2 border-health-primary/30 hover:border-health-primary text-health-primary hover:text-health-primary font-semibold px-6 py-3 rounded-xl shadow-soft hover:shadow-health transform hover:scale-105 transition-all duration-300"
          >
            {isShuffling ? (
              <>
                <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                Shuffling...
              </>
            ) : (
              <>
                <Shuffle className="w-5 h-5 mr-2" />
                Shuffle Weekly Meals
              </>
            )}
          </Button>
          
          {/* Enhanced GENERATE Button */}
          <Button
            onClick={onShowAIDialog}
            disabled={isGenerating || isShuffling}
            className="bg-health-gradient hover:opacity-90 text-white shadow-health hover:shadow-elevated transform hover:scale-105 transition-all duration-300 px-6 py-3 rounded-xl font-semibold"
          >
            {isGenerating ? (
              <>
                <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate New AI Plan
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MealPlanHeader;


import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Sparkles, RotateCcw, Utensils, Shuffle } from "lucide-react";

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
      case 'Vegetarian': return 'bg-green-100 text-green-800 border-green-200';
      case 'Keto': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'High Protein': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Low Carb': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Diet Type Highlight Card */}
      {dietType && (
        <Card className="p-4 bg-gradient-to-r from-fitness-primary/10 to-pink-100 border-0 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Utensils className="w-6 h-6 text-fitness-primary" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Your Meal Plan</h3>
                <p className="text-sm text-gray-600">Personalized nutrition for your fitness goals</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={`${getDietTypeColor(dietType)} font-semibold px-3 py-1`}>
                {dietType} Diet
              </Badge>
              {totalWeeklyCalories && (
                <Badge variant="outline" className="bg-white/80">
                  {Math.round(totalWeeklyCalories / 7)} cal/day
                </Badge>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meal Plan</h1>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{currentDay}, {currentDate}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* SHUFFLE EXISTING MEALS - Professional shuffle functionality */}
          <Button
            onClick={onRegeneratePlan}
            variant="outline"
            disabled={isGenerating || isShuffling}
            className="bg-white/80 hover:bg-white border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800"
          >
            {isShuffling ? (
              <>
                <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                Shuffling...
              </>
            ) : (
              <>
                <Shuffle className="w-4 h-4 mr-2" />
                Shuffle Weekly Meals
              </>
            )}
          </Button>
          
          {/* GENERATE NEW AI PLAN - Full AI generation with preferences */}
          <Button
            onClick={onShowAIDialog}
            disabled={isGenerating || isShuffling}
            className="bg-fitness-gradient hover:opacity-90 text-white shadow-lg"
          >
            {isGenerating ? (
              <>
                <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
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


import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Calendar, Target, Flame, ShoppingCart, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface MealPlanHeroSectionProps {
  selectedDate: Date;
  selectedDayNumber: number;
  totalCalories: number;
  onShowShoppingDialog: () => void;
  onShowAIDialog: () => void;
}

const MealPlanHeroSection = ({
  selectedDate,
  selectedDayNumber,
  totalCalories,
  onShowShoppingDialog,
  onShowAIDialog
}: MealPlanHeroSectionProps) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-xl" />
      <Card className="relative bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl -translate-y-24 translate-x-24" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-400/30 to-orange-400/30 rounded-full blur-3xl translate-y-16 -translate-x-16" />
        
        <CardHeader className="relative z-10 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <ChefHat className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Your Meal Plan
                  </h1>
                  <p className="text-lg text-gray-600 font-medium">
                    AI-Powered Personalized Nutrition
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(selectedDate, 'EEEE, MMMM d')}
                </Badge>
                <Badge variant="outline" className="bg-white/80 border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium">
                  <Target className="w-4 h-4 mr-2" />
                  Day {selectedDayNumber} of 7
                </Badge>
                {totalCalories > 0 && (
                  <Badge variant="outline" className="bg-white/80 border-green-300 text-green-700 px-4 py-2 text-sm font-medium">
                    <Flame className="w-4 h-4 mr-2" />
                    {totalCalories} calories
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={onShowShoppingDialog}
                variant="outline"
                size="lg"
                className="bg-white/90 hover:bg-white border-gray-200 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Shopping List
              </Button>
              
              <Button
                onClick={onShowAIDialog}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-xl px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate AI Plan
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default MealPlanHeroSection;

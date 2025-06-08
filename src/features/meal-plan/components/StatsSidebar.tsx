import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus, RotateCcw, TrendingUp, Award, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StatsSidebarProps {
  todaysMeals: any[];
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  onAddSnack: () => void;
  onRegeneratePlan: () => void;
}

const StatsSidebar = ({
  todaysMeals,
  totalCalories,
  totalProtein,
  targetDayCalories,
  onAddSnack,
  onRegeneratePlan
}: StatsSidebarProps) => {
  const { t, isRTL } = useLanguage();

  const proteinGoal = 150; // This could be dynamic based on user profile
  const proteinProgress = Math.min(100, (totalProtein / proteinGoal) * 100);

  return (
    <div className="sticky top-6 space-y-6">
      {/* Today's Progress Card */}
      <Card className="bg-gradient-to-br from-white to-blue-50/80 border-0 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white pb-4">
          <CardTitle className={`text-xl font-bold flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Target className="w-6 h-6" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Calories */}
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{totalCalories}</div>
              <div className="text-sm text-gray-600 mb-3">calories consumed</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (totalCalories / targetDayCalories) * 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{targetDayCalories} goal</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{totalProtein.toFixed(1)}g</div>
                <div className="text-xs text-blue-700 font-medium">Protein</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{todaysMeals?.length || 0}</div>
                <div className="text-xs text-green-700 font-medium">Meals</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Protein Goal Card */}
      <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Award className="w-5 h-5" />
            Protein Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{totalProtein.toFixed(1)}g</div>
              <div className="text-sm opacity-90">of {proteinGoal}g target</div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-300" 
                style={{ width: `${proteinProgress}%` }}
              ></div>
            </div>
            <div className="text-center text-sm opacity-90">
              {proteinProgress.toFixed(0)}% Complete
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-90">Meals Planned</span>
              <span className="font-bold">21/21</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-90">Days Tracked</span>
              <span className="font-bold">7/7</span>
            </div>
            <div className="text-center pt-2">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <div className="text-sm font-medium">Great Progress!</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white shadow-xl rounded-2xl border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-gray-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={onAddSnack}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Snack
          </Button>
          <Button 
            onClick={onRegeneratePlan}
            variant="outline" 
            className="w-full border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Regenerate Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsSidebar;

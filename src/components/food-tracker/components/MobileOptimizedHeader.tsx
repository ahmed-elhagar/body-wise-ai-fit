import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Camera, Menu, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MobileOptimizedHeaderProps {
  todayStats: {
    calories: number;
    protein: number;
    remainingCalories: number;
    mealsLogged: number;
  };
  onAddFood: () => void;
}

const MobileOptimizedHeader = ({ todayStats, onAddFood }: MobileOptimizedHeaderProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Today's Nutrition</h1>
            <p className="text-sm text-gray-600">Track your daily intake</p>
          </div>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Quick Actions</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <Button
                  onClick={() => {
                    onAddFood();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Food
                </Button>
                
                <Button
                  onClick={() => {
                    navigate('/calorie-checker');
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Scan Food
                </Button>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">Today's Progress</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Calories</span>
                      <Badge variant="outline">
                        {Math.round(todayStats.calories)} / 2000
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Protein</span>
                      <Badge variant="outline">
                        {Math.round(todayStats.protein)}g
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Meals Logged</span>
                      <Badge variant="outline">
                        {todayStats.mealsLogged}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Quick stats for mobile */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{Math.round(todayStats.calories)}</div>
              <div className="text-xs text-gray-500">Calories today</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{Math.round(todayStats.protein)}g</div>
              <div className="text-xs text-gray-500">Protein today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header (unchanged) */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Food Tracker
              </h1>
              <p className="text-gray-600 mt-1">
                Track your daily nutrition and calories
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/calorie-checker')}
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <Camera className="w-4 h-4 mr-2" />
              Scan Food
            </Button>
            
            <Button
              onClick={onAddFood}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Food
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileOptimizedHeader;

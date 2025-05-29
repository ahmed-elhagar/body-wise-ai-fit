
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Search, Heart, BarChart3, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";
import FoodPhotoAnalyzer from "@/components/calorie/FoodPhotoAnalyzer";
import EnhancedFoodSearch from "@/components/calorie/EnhancedFoodSearch";
import FoodConsumptionTracker from "@/components/calorie/FoodConsumptionTracker";
import { useFoodDatabase } from "@/hooks/useFoodDatabase";
import AddFoodDialog from "@/components/calorie/AddFoodDialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const CalorieChecker = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t, isRTL } = useLanguage();
  const { logConsumption, isLoggingConsumption } = useFoodDatabase();
  
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState("today");

  const handleSelectFood = (food: any) => {
    console.log('Selected food:', food);
    setSelectedFood(food);
    setIsAddDialogOpen(true);
  };

  const handleLogFood = (logData: any) => {
    console.log('Logging food data:', logData);
    logConsumption(logData);
    setIsAddDialogOpen(false);
    setSelectedFood(null);
  };

  const views = [
    {
      id: "today",
      label: "Today",
      icon: BarChart3,
      component: <FoodConsumptionTracker onSelectFood={handleSelectFood} />
    },
    {
      id: "search",
      label: "Search",
      icon: Search,
      component: <EnhancedFoodSearch onSelectFood={handleSelectFood} />
    },
    {
      id: "scan",
      label: "AI Scan",
      icon: Camera,
      component: <FoodPhotoAnalyzer onSelectFood={handleSelectFood} />
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: Heart,
      component: <EnhancedFoodSearch onSelectFood={handleSelectFood} showFavoritesOnly />
    }
  ];

  const activeViewData = views.find(view => view.id === activeView);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Nutrition Tracker</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Track your daily nutrition and analyze foods</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-t border-gray-100">
            <nav className="flex space-x-8 py-4" aria-label="Tabs">
              {views.map((view) => {
                const IconComponent = view.icon;
                return (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeView === view.id
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">{view.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Active View Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              {activeViewData && (
                <>
                  <activeViewData.icon className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    {activeViewData.label}
                  </h2>
                </>
              )}
            </div>
            <p className="text-gray-600">
              {activeView === "today" && "Monitor your daily nutrition progress and track consumed foods"}
              {activeView === "search" && "Search our comprehensive food database to log your meals"}
              {activeView === "scan" && "Use AI to analyze food photos and get nutrition information"}
              {activeView === "favorites" && "Access your favorite foods and frequently logged items"}
            </p>
          </div>

          {/* Active View Content */}
          <div>
            {activeViewData?.component}
          </div>
        </div>
      </div>

      {/* Add Food Dialog */}
      <AddFoodDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        selectedFood={selectedFood}
        onLogFood={handleLogFood}
        isLogging={isLoggingConsumption}
      />
    </div>
  );
};

export default CalorieChecker;

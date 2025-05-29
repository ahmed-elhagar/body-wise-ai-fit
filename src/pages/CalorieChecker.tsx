
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Search, Heart, BarChart3, Menu, X } from "lucide-react";
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
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const handleSelectFood = (food: any) => {
    setSelectedFood(food);
    setIsAddDialogOpen(true);
  };

  const handleLogFood = (logData: any) => {
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

  const SideMenu = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Nutrition Tracker</h2>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSideMenuOpen(false)}
              className="p-1"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">Track your daily nutrition</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <div className="space-y-2">
          {views.map((view) => {
            const IconComponent = view.icon;
            return (
              <Button
                key={view.id}
                variant={activeView === view.id ? "default" : "ghost"}
                onClick={() => {
                  setActiveView(view.id);
                  if (isMobile) setIsSideMenuOpen(false);
                }}
                className={`w-full justify-start gap-3 h-11 ${
                  activeView === view.id 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{view.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Back to Dashboard */}
      <div className="p-4 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="w-full justify-start gap-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sheet open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-80">
                    <SideMenu />
                  </SheetContent>
                </Sheet>
                
                <div>
                  <h1 className="text-lg font-bold text-gray-800">
                    {activeViewData?.label}
                  </h1>
                  <p className="text-xs text-gray-600">
                    {activeView === "today" && "Track your daily intake"}
                    {activeView === "search" && "Find foods in database"}
                    {activeView === "scan" && "Scan food with AI"}
                    {activeView === "favorites" && "Your saved foods"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4">
          {activeViewData?.component}
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
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Desktop Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 shadow-sm">
        <SideMenu />
      </div>

      {/* Desktop Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Desktop Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {activeViewData?.label}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {activeView === "today" && "Monitor your daily nutrition progress"}
                {activeView === "search" && "Search our comprehensive food database"}
                {activeView === "scan" && "Use AI to analyze food photos"}
                {activeView === "favorites" && "Access your favorite foods quickly"}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
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

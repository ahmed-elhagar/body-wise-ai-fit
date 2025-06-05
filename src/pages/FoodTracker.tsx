
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Utensils, Camera, History } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFoodConsumption } from "@/hooks/useFoodConsumption";
import { useLocation, useNavigate } from "react-router-dom";
import TodayTab from "@/components/food-tracker/TodayTab";
import HistoryTab from "@/components/food-tracker/HistoryTab";
import AddFoodDialog from "@/components/food-tracker/AddFoodDialog/AddFoodDialog";
import { toast } from "sonner";
import { useQueryClient } from '@tanstack/react-query';

const FoodTracker = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [preSelectedFood, setPreSelectedFood] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("today");
  const { forceRefresh } = useFoodConsumption();

  // Handle analyzed food from Calorie Checker or AI Scanner
  useEffect(() => {
    console.log('📍 FoodTracker location state:', location.state);
    
    if (location.state?.analyzedFood) {
      console.log('🍕 Received analyzed food:', location.state.analyzedFood);
      setPreSelectedFood(location.state.analyzedFood);
      
      if (location.state?.openAddDialog) {
        setIsAddFoodOpen(true);
      }
      
      // Clear the state to prevent reopening on future navigations
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleFoodAdded = async () => {
    console.log('🔄 Food added, refreshing data...');
    setIsAddFoodOpen(false);
    setPreSelectedFood(null);
    
    try {
      // Clear all food consumption queries with specific user-based invalidation
      console.log('🧹 Clearing query cache...');
      await queryClient.invalidateQueries({ 
        queryKey: ['food-consumption'],
        exact: false 
      });
      
      // Force refresh of food consumption data
      console.log('🔄 Force refreshing consumption data...');
      await forceRefresh();
      
      // Force component re-render with new key
      setRefreshKey(prev => {
        console.log('🔑 Updating refresh key from', prev, 'to', prev + 1);
        return prev + 1;
      });
      
      // Show success message
      toast.success('Food added successfully!');
      
      console.log('✅ Data refresh completed');
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
      toast.error('Food added but failed to refresh data');
    }
  };

  const handleOpenAddDialog = () => {
    setPreSelectedFood(null);
    setIsAddFoodOpen(true);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-3 sm:p-4 md:p-6">
          <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
            {/* Desktop Header - hidden on mobile */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Utensils className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {t('Food Tracker')}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {t('Track your daily nutrition and calories')}
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
                  {t('Scan Food')}
                </Button>
                
                <Button
                  onClick={handleOpenAddDialog}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('Add Food')}
                </Button>
              </div>
            </div>

            {/* Enhanced Mobile-First Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 h-12">
                <TabsTrigger 
                  value="today" 
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-sm sm:text-base font-medium flex items-center gap-2"
                >
                  <Utensils className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('Today')}</span>
                  <span className="sm:hidden">{t('Today')}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-sm sm:text-base font-medium flex items-center gap-2"
                >
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('History')}</span>
                  <span className="sm:hidden">{t('History')}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="today" className="mt-4 sm:mt-6">
                <TodayTab key={refreshKey} onAddFood={handleOpenAddDialog} />
              </TabsContent>

              <TabsContent value="history" className="mt-4 sm:mt-6">
                <HistoryTab />
              </TabsContent>
            </Tabs>

            {/* Add Food Dialog */}
            <AddFoodDialog
              isOpen={isAddFoodOpen}
              onClose={() => {
                setIsAddFoodOpen(false);
                setPreSelectedFood(null);
              }}
              onFoodAdded={handleFoodAdded}
              preSelectedFood={preSelectedFood}
            />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default FoodTracker;

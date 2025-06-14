
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Utensils, Camera, History, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFoodConsumption } from "@/features/food-tracker/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { TodayTab, HistoryTab } from "@/features/food-tracker";
import AddFoodDialog from "@/features/food-tracker/components/AddFoodDialog";
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
              {/* Enhanced Header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 border-0 shadow-xl rounded-2xl">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
                
                <div className="relative p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <Utensils className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                            {t('Food Tracker')}
                          </h1>
                          <p className="text-white/80 text-lg">
                            {t('Track your daily nutrition and calories')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <div className="bg-white/20 text-white border-white/30 px-4 py-2 rounded-lg backdrop-blur-sm border flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          AI-Powered Tracking
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={() => navigate('/calorie-checker')}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 px-6 py-3 rounded-xl"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {t('Scan Food')}
                      </Button>
                      
                      <Button
                        onClick={handleOpenAddDialog}
                        className="bg-white text-green-600 hover:bg-white/90 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('Add Food')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg h-14 rounded-xl">
                  <TabsTrigger 
                    value="today" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-base font-medium flex items-center gap-3 rounded-lg transition-all duration-300"
                  >
                    <Utensils className="w-4 h-4" />
                    <span>{t('Today')}</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-base font-medium flex items-center gap-3 rounded-lg transition-all duration-300"
                  >
                    <History className="w-4 h-4" />
                    <span>{t('History')}</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="today" className="mt-6">
                  <TodayTab key={refreshKey} onAddFood={handleOpenAddDialog} />
                </TabsContent>

                <TabsContent value="history" className="mt-6">
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
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default FoodTracker;

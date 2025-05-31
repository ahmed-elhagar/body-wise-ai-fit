
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Utensils } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFoodConsumption } from "@/hooks/useFoodConsumption";
import TodayTab from "@/components/food-tracker/TodayTab";
import HistoryTab from "@/components/food-tracker/HistoryTab";
import AddFoodDialog from "@/components/food-tracker/AddFoodDialog/AddFoodDialog";

const FoodTracker = () => {
  const { t } = useLanguage();
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const { refetch } = useFoodConsumption();

  const handleFoodAdded = () => {
    refetch();
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-4 md:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
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
              
              <Button
                onClick={() => setIsAddFoodOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('Add Food')}
              </Button>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="today" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger 
                  value="today" 
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900"
                >
                  {t('Today')}
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-900"
                >
                  {t('History')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="today" className="mt-6">
                <TodayTab />
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <HistoryTab />
              </TabsContent>
            </Tabs>

            {/* Add Food Dialog */}
            <AddFoodDialog
              isOpen={isAddFoodOpen}
              onClose={() => setIsAddFoodOpen(false)}
              onFoodAdded={handleFoodAdded}
            />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default FoodTracker;

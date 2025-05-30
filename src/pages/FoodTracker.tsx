
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useLanguage } from "@/contexts/LanguageContext";
import TodayTab from "@/components/food-tracker/TodayTab";
import HistoryTab from "@/components/food-tracker/HistoryTab";
import { Utensils, Calendar } from "lucide-react";

const FoodTracker = () => {
  const { t, isRTL } = useLanguage();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Utensils className="w-8 h-8 text-green-600" />
              {t('Food Tracker')}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('Track your nutrition and maintain healthy eating habits')}
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
              <TabsTrigger 
                value="today" 
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex items-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                {t('Today')}
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
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
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default FoodTracker;

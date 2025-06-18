
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, History, Plus } from 'lucide-react';
import { useFoodTracking } from '../hooks/useFoodTracking';
import FoodLogTimeline from './FoodLogTimeline';
import AddFoodDialog from './AddFoodDialog';
import NutritionSummary from './NutritionSummary';

const FoodTrackerContainer = () => {
  const { 
    foodLogs, 
    nutritionSummary, 
    selectedDate, 
    setSelectedDate,
    isLoading,
    refetch 
  } = useFoodTracking();
  
  const [activeTab, setActiveTab] = React.useState("today");
  const [isAddFoodOpen, setIsAddFoodOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Nutrition Summary */}
      <NutritionSummary 
        summary={nutritionSummary}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="today" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Today
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <FoodLogTimeline 
            foodLogs={foodLogs}
            isLoading={isLoading}
            onRefetch={refetch}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <p>Food history will be available soon</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Food Dialog */}
      <AddFoodDialog
        isOpen={isAddFoodOpen}
        onClose={() => setIsAddFoodOpen(false)}
        onFoodAdded={() => {
          refetch();
          setIsAddFoodOpen(false);
        }}
      />

      {/* Floating Action Button */}
      <button
        onClick={() => setIsAddFoodOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default FoodTrackerContainer;

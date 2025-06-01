
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit3 } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useFoodConsumption } from "@/hooks/useFoodConsumption";
import MacroWheel from "./components/MacroWheel";
import FoodLogTimeline from "./components/FoodLogTimeline";
import AddFoodDialog from "./AddFoodDialog/AddFoodDialog";
import { format } from "date-fns";

const TodayTab = () => {
  const { t, isRTL } = useI18n();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { todayConsumption, isLoading, refetch } = useFoodConsumption();

  // Calculate daily totals
  const dailyTotals = todayConsumption?.reduce(
    (acc, item) => ({
      calories: acc.calories + (item.calories_consumed || 0),
      protein: acc.protein + (item.protein_consumed || 0),
      carbs: acc.carbs + (item.carbs_consumed || 0),
      fat: acc.fat + (item.fat_consumed || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  ) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const handleFoodAdded = () => {
    setShowAddDialog(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Macros Overview */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center gap-2">
              {t('Daily Nutrition')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MacroWheel 
              calories={dailyTotals.calories}
              protein={dailyTotals.protein}
              carbs={dailyTotals.carbs}
              fat={dailyTotals.fat}
            />
            
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('Calories')}</span>
                <span className="font-semibold text-gray-900">
                  {Math.round(dailyTotals.calories)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('Protein')}</span>
                <span className="font-semibold text-gray-900">
                  {Math.round(dailyTotals.protein)}g
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('Carbs')}</span>
                <span className="font-semibold text-gray-900">
                  {Math.round(dailyTotals.carbs)}g
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('Fat')}</span>
                <span className="font-semibold text-gray-900">
                  {Math.round(dailyTotals.fat)}g
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Food Timeline */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900">
                {t('Today\'s Food Log')} - {format(new Date(), 'MMM d, yyyy')}
              </CardTitle>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('Add Food')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <FoodLogTimeline 
              foodLogs={todayConsumption || []}
              onRefetch={refetch}
            />
          </CardContent>
        </Card>
      </div>

      {/* Floating Add Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button
          onClick={() => setShowAddDialog(true)}
          className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Add Food Dialog */}
      <AddFoodDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onFoodAdded={handleFoodAdded}
      />
    </div>
  );
};

export default TodayTab;

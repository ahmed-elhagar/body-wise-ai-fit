
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Clock, Camera, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { FoodConsumptionLog } from "@/hooks/useFoodConsumption";
import { useFoodConsumption } from "@/hooks/useFoodConsumption";
import { useMealComments } from "@/hooks/useMealComments";
import MealCommentsDrawer from "../MealCommentsDrawer";

interface FoodLogTimelineProps {
  foodLogs: FoodConsumptionLog[];
  onRefetch: () => void;
}

const FoodLogTimeline = ({ foodLogs, onRefetch }: FoodLogTimelineProps) => {
  const { t, isRTL } = useLanguage();
  const { deleteConsumption, isDeletingConsumption } = useFoodConsumption();
  const { getCommentCount } = useMealComments();
  
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [selectedMealForComments, setSelectedMealForComments] = useState<FoodConsumptionLog | null>(null);

  // Load comment counts for all food logs
  useEffect(() => {
    const loadCommentCounts = async () => {
      const counts: Record<string, number> = {};
      for (const log of foodLogs) {
        counts[log.id] = await getCommentCount(log.id);
      }
      setCommentCounts(counts);
    };

    if (foodLogs.length > 0) {
      loadCommentCounts();
    }
  }, [foodLogs, getCommentCount]);

  const handleDelete = async (logId: string) => {
    if (confirm(t('Are you sure you want to delete this food log entry?'))) {
      deleteConsumption(logId);
      onRefetch();
    }
  };

  const handleOpenComments = (log: FoodConsumptionLog) => {
    setSelectedMealForComments(log);
  };

  const handleCloseComments = () => {
    setSelectedMealForComments(null);
    // Refresh comment counts when drawer closes
    const loadCommentCounts = async () => {
      const counts: Record<string, number> = {};
      for (const log of foodLogs) {
        counts[log.id] = await getCommentCount(log.id);
      }
      setCommentCounts(counts);
    };
    loadCommentCounts();
  };

  // Group by meal type
  const groupedLogs = foodLogs.reduce((acc, log) => {
    const mealType = log.meal_type || 'snack';
    if (!acc[mealType]) {
      acc[mealType] = [];
    }
    acc[mealType].push(log);
    return acc;
  }, {} as Record<string, FoodConsumptionLog[]>);

  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack'];

  if (foodLogs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">{t('No food logged today')}</p>
        <p className="text-sm">{t('Start tracking your nutrition by adding your first meal!')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {mealOrder.map(mealType => {
          const logs = groupedLogs[mealType];
          if (!logs || logs.length === 0) return null;

          const mealTotals = logs.reduce(
            (acc, log) => ({
              calories: acc.calories + (log.calories_consumed || 0),
              protein: acc.protein + (log.protein_consumed || 0),
              carbs: acc.carbs + (log.carbs_consumed || 0),
              fat: acc.fat + (log.fat_consumed || 0),
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
          );

          return (
            <div key={mealType} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {t(mealType)}
                </h3>
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  {Math.round(mealTotals.calories)} {t('cal')}
                </Badge>
              </div>

              <div className="space-y-3">
                {logs.map((log) => (
                  <Card key={log.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          {log.meal_image_url && (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <img 
                                src={log.meal_image_url} 
                                alt="Meal"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {log.food_item?.name || 'Unknown Food'}
                            </h4>
                            
                            {log.food_item?.brand && (
                              <p className="text-sm text-gray-500">
                                {log.food_item.brand}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span>{log.quantity_g}g</span>
                              <span>{Math.round(log.calories_consumed || 0)} cal</span>
                              <span>{Math.round(log.protein_consumed || 0)}g protein</span>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {format(new Date(log.consumed_at), 'HH:mm')}
                              {log.source === 'ai_analysis' && (
                                <>
                                  <Camera className="w-3 h-3 ml-2" />
                                  {t('AI Scanned')}
                                </>
                              )}
                            </div>
                            
                            {log.notes && (
                              <p className="text-sm text-gray-600 mt-2 italic">
                                {log.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {/* Comment Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenComments(log)}
                          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 relative p-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          {commentCounts[log.id] > 0 && (
                            <Badge className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0">
                              {commentCounts[log.id]}
                            </Badge>
                          )}
                        </Button>
                        
                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(log.id)}
                          disabled={isDeletingConsumption}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comments Drawer */}
      {selectedMealForComments && (
        <MealCommentsDrawer
          isOpen={!!selectedMealForComments}
          onClose={handleCloseComments}
          mealLogId={selectedMealForComments.id}
          traineeId={selectedMealForComments.user_id}
          mealName={selectedMealForComments.food_item?.name || 'Unknown Food'}
        />
      )}
    </>
  );
};

export default FoodLogTimeline;

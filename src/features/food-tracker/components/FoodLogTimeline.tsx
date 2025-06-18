
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Clock, Camera } from "lucide-react";
import { format } from "date-fns";
import { useFoodTracking } from '../hooks/useFoodTracking';
import type { FoodConsumptionLog } from '../types';

interface FoodLogTimelineProps {
  foodLogs: FoodConsumptionLog[];
  isLoading: boolean;
  onRefetch: () => void;
}

const FoodLogTimeline = ({ foodLogs, isLoading, onRefetch }: FoodLogTimelineProps) => {
  const { deleteFoodConsumption, isDeleting } = useFoodTracking();

  const handleDelete = async (logId: string) => {
    if (confirm('Are you sure you want to delete this food log entry?')) {
      deleteFoodConsumption(logId);
    }
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </Card>
        ))}
      </div>
    );
  }

  if (foodLogs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">No food logged today</p>
        <p className="text-sm">Start tracking your nutrition by adding your first meal!</p>
      </div>
    );
  }

  return (
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
                {mealType}
              </h3>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                {Math.round(mealTotals.calories)} cal
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
                                AI Scanned
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(log.id)}
                        disabled={isDeleting}
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
  );
};

export default FoodLogTimeline;

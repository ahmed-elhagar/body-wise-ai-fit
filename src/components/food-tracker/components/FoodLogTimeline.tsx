
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Edit, Trash2, MessageCircle } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";
import type { FoodConsumptionLog } from '@/types/food';

interface FoodLogTimelineProps {
  foodLogs: FoodConsumptionLog[];
}

const FoodLogTimeline = ({ foodLogs }: FoodLogTimelineProps) => {
  const { t } = useI18n();
  const [selectedLog, setSelectedLog] = useState<FoodConsumptionLog | null>(null);

  const handleEditLog = (log: FoodConsumptionLog) => {
    setSelectedLog(log);
    console.log('Edit log:', log);
  };

  const handleDeleteLog = (log: FoodConsumptionLog) => {
    console.log('Delete log:', log);
  };

  const handleAddComment = (log: FoodConsumptionLog) => {
    console.log('Add comment to log:', log);
  };

  const groupedLogs = foodLogs.reduce((groups, log) => {
    const mealType = log.meal_type || 'other';
    if (!groups[mealType]) {
      groups[mealType] = [];
    }
    groups[mealType].push(log);
    return groups;
  }, {} as Record<string, FoodConsumptionLog[]>);

  return (
    <div className="space-y-4">
      {Object.entries(groupedLogs).map(([mealType, logs]) => (
        <Card key={mealType}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg capitalize flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t(mealType) || mealType}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">Food Item</div>
                  <div className="text-sm text-gray-600">
                    {log.quantity_g}g • {log.calories_consumed} cal
                  </div>
                  {log.notes && (
                    <div className="text-sm text-gray-500 mt-1">{log.notes}</div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {new Date(log.consumed_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Badge>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditLog(log)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddComment(log)}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLog(log)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FoodLogTimeline;

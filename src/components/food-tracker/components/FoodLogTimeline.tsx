import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Utensils, MessageSquare } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";
import { format, isToday, isYesterday, isPast, isFuture, parseISO } from 'date-fns';
import { ptBR, enUS, ar } from 'date-fns/locale';

interface FoodLogTimelineProps {
  foodLogs: any[];
  onShowMealComments: (meal: any) => void;
}

const FoodLogTimeline = ({ foodLogs, onShowMealComments }: FoodLogTimelineProps) => {
  const { t, language } = useI18n();

  const getLocale = () => {
    switch (language) {
      case 'pt':
        return ptBR;
      case 'ar':
        return ar;
      default:
        return enUS;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    const locale = getLocale();

    if (isToday(date)) {
      return t('Today');
    } else if (isYesterday(date)) {
      return t('Yesterday');
    } else if (isPast(date, new Date())) {
      return format(date, 'MMMM d, yyyy', { locale });
    } else if (isFuture(date, new Date())) {
      return t('Upcoming');
    } else {
      return format(date, 'MMMM d, yyyy', { locale });
    }
  };

  const formatTime = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, 'h:mm a');
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle>{t('Food Log Timeline')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {foodLogs.length === 0 ? (
          <p className="text-center text-gray-500">{t('No food logs found')}</p>
        ) : (
          foodLogs.map((log) => (
            <div key={log.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700">{formatDate(log.date)}</div>
                <div className="text-xs text-gray-500">{formatTime(log.date)}</div>
              </div>
              <div className="space-y-2">
                {log.meals.map((meal: any) => (
                  <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">{meal.name}</h4>
                      <p className="text-xs text-gray-600 capitalize">{meal.meal_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{meal.calories} cal</p>
                      <p className="text-xs text-gray-600">{meal.protein}g protein</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onShowMealComments(meal)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default FoodLogTimeline;

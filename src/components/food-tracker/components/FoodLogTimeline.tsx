
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MoreVertical, MessageSquare } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import MealCommentsDrawer from '../MealCommentsDrawer';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface FoodLogTimelineProps {
  entries: FoodEntry[];
  onEditEntry: (id: string) => void;
  onDeleteEntry: (id: string) => void;
}

export const FoodLogTimeline = ({ entries, onEditEntry, onDeleteEntry }: FoodLogTimelineProps) => {
  const { t, isRTL } = useI18n();

  const groupedEntries = entries.reduce((groups, entry) => {
    if (!groups[entry.mealType]) {
      groups[entry.mealType] = [];
    }
    groups[entry.mealType].push(entry);
    return groups;
  }, {} as Record<string, FoodEntry[]>);

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  
  const getMealTypeIcon = (mealType: string) => {
    const icons = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
      snack: '🍎'
    };
    return icons[mealType as keyof typeof icons] || '🍽️';
  };

  const getMealTypeName = (mealType: string) => {
    return t(`foodTracker:${mealType}`) || mealType.charAt(0).toUpperCase() + mealType.slice(1);
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {mealTypes.map((mealType) => {
        const mealEntries = groupedEntries[mealType] || [];
        const mealCalories = mealEntries.reduce((sum, entry) => sum + entry.calories, 0);
        const mealProtein = mealEntries.reduce((sum, entry) => sum + entry.protein, 0);

        return (
          <div key={mealType} className="space-y-3">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-2xl">{getMealTypeIcon(mealType)}</span>
                <h3 className="font-semibold text-lg">{getMealTypeName(mealType)}</h3>
                {mealEntries.length > 0 && (
                  <Badge variant="secondary">
                    {mealCalories} cal • {mealProtein.toFixed(1)}g protein
                  </Badge>
                )}
              </div>
            </div>

            {mealEntries.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-200">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">
                    {t('foodTracker:noFoodsYet') || 'No foods logged yet'}
                  </p>
                  <Button variant="ghost" className="mt-2">
                    {t('foodTracker:addFood') || 'Add Food'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {mealEntries.map((entry) => (
                  <Card key={entry.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center gap-1 text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{entry.time}</span>
                          </div>
                          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <h4 className="font-medium">{entry.name}</h4>
                            <div className={`flex gap-3 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span>{entry.calories} cal</span>
                              <span>{entry.protein}g protein</span>
                              <span>{entry.carbs}g carbs</span>
                              <span>{entry.fat}g fat</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <MealCommentsDrawer meal={entry}>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </MealCommentsDrawer>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FoodLogTimeline;

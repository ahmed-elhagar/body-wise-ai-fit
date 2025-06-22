
import React from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFoodConsumption } from '../hooks';

export interface TodayTabProps {
  onAddFood: () => void;
}

const TodayTab: React.FC<TodayTabProps> = ({ onAddFood }) => {
  const { t } = useTranslation(['foodTracker', 'common']);
  const { todayConsumption, isLoading } = useFoodConsumption();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];

  return (
    <div className="space-y-6">
      {/* Meal sections */}
      {mealTypes.map((mealType) => {
        const mealItems = todayConsumption?.filter(item => item.meal_type === mealType) || [];
        
        return (
          <Card key={mealType} className="card-enhanced">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg capitalize">
                  {t(mealType)}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAddFood}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  {t('add_food')}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {mealItems.length > 0 ? (
                <div className="space-y-2">
                  {mealItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {item.food_item?.name || 'Unknown Food'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.quantity_g}g - {Math.round(item.calories_consumed)} {t('common:units.calories')}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>P: {Math.round(item.protein_consumed)}g</p>
                        <p>C: {Math.round(item.carbs_consumed)}g</p>
                        <p>F: {Math.round(item.fat_consumed)}g</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>{t('no_meals_logged')}</p>
                  <p className="text-sm mt-1">{t('start_logging')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
      
      {/* Empty state if no consumption data */}
      {(!todayConsumption || todayConsumption.length === 0) && (
        <Card className="card-enhanced">
          <CardContent className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg font-medium mb-2">{t('no_meals_logged')}</p>
              <p className="text-sm mb-4">{t('start_logging')}</p>
              <Button onClick={onAddFood} className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                {t('add_food')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TodayTab;

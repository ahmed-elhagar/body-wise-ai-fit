
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ChefHat, X } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface EnhancedRecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: any;
}

const EnhancedRecipeDialog = ({ isOpen, onClose, meal }: EnhancedRecipeDialogProps) => {
  const { t, isRTL } = useI18n();

  if (!meal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {meal.name}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meal Info */}
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <Clock className="w-3 h-3 mr-1" />
              {(meal.prep_time || 0) + (meal.cook_time || 0)} {t('mealPlan.min')}
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <Users className="w-3 h-3 mr-1" />
              {meal.servings || 1} {t('mealPlan.servings')}
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700">
              <ChefHat className="w-3 h-3 mr-1" />
              {meal.calories || 0} {t('mealPlan.cal')}
            </Badge>
          </div>

          {/* Nutrition Info */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{meal.calories || 0}</div>
              <div className="text-sm text-gray-600">{t('mealPlan.calories')}</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{meal.protein || 0}g</div>
              <div className="text-sm text-gray-600">{t('mealPlan.protein')}</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{meal.carbs || 0}g</div>
              <div className="text-sm text-gray-600">{t('mealPlan.carbs')}</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{meal.fats || 0}g</div>
              <div className="text-sm text-gray-600">{t('mealPlan.fats')}</div>
            </div>
          </div>

          {/* Ingredients */}
          {meal.ingredients && (
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('mealPlan.ingredients')}</h3>
              <ul className="space-y-2">
                {meal.ingredients.map((ingredient: any, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>{ingredient.quantity} {ingredient.unit} {ingredient.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions */}
          {meal.instructions && (
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('mealPlan.instructions')}</h3>
              <ol className="space-y-3">
                {meal.instructions.map((instruction: string, index: number) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedRecipeDialog;

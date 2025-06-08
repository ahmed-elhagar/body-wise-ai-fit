
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ChefHat } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface EnhancedRecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: any;
  onRecipeUpdated?: () => void;
}

const EnhancedRecipeDialog = ({
  isOpen,
  onClose,
  meal,
  onRecipeUpdated
}: EnhancedRecipeDialogProps) => {
  const { t } = useI18n();

  if (!meal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5" />
            {meal.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meal Info */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {meal.calories} cal
            </Badge>
            {meal.prepTime && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {meal.prepTime} min
              </Badge>
            )}
            {meal.servings && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {meal.servings} servings
              </Badge>
            )}
          </div>

          {/* Nutrition Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Nutrition Information</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{meal.protein || 0}g</p>
                  <p className="text-sm text-gray-600">Protein</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{meal.carbs || 0}g</p>
                  <p className="text-sm text-gray-600">Carbs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{meal.fat || 0}g</p>
                  <p className="text-sm text-gray-600">Fat</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          {meal.ingredients && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {meal.ingredients.map((ingredient: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          {meal.instructions && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Instructions</h3>
                <ol className="space-y-3">
                  {meal.instructions.map((step: string, index: number) => (
                    <li key={index} className="flex gap-3">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="flex-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedRecipeDialog;

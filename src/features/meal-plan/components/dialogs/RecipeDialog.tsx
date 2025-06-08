
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, ChefHat, X, Star, Heart, Share2 } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface RecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: any;
}

const RecipeDialog = ({ isOpen, onClose, meal }: RecipeDialogProps) => {
  const { t, isRTL } = useI18n();
  const [activeTab, setActiveTab] = useState('overview');

  if (!meal) return null;

  const totalTime = (meal.prep_time || 0) + (meal.cook_time || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex-1">
              {meal.name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">{t('Overview')}</TabsTrigger>
            <TabsTrigger value="ingredients">{t('Ingredients')}</TabsTrigger>
            <TabsTrigger value="instructions">{t('Instructions')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Recipe Info */}
            <div className={`flex items-center gap-4 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Clock className="w-3 h-3 mr-1" />
                {totalTime} {t('min')}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Users className="w-3 h-3 mr-1" />
                {meal.servings || 1} {t('servings')}
              </Badge>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                <ChefHat className="w-3 h-3 mr-1" />
                {meal.meal_type}
              </Badge>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-600 ml-1">4.8 (124 reviews)</span>
              </div>
            </div>

            {/* Nutrition Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="text-3xl font-bold text-red-600">{meal.calories || 0}</div>
                <div className="text-sm text-gray-600">{t('Calories')}</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-3xl font-bold text-blue-600">{meal.protein || 0}g</div>
                <div className="text-sm text-gray-600">{t('Protein')}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="text-3xl font-bold text-green-600">{meal.carbs || 0}g</div>
                <div className="text-sm text-gray-600">{t('Carbs')}</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="text-3xl font-bold text-yellow-600">{meal.fats || 0}g</div>
                <div className="text-sm text-gray-600">{t('Fats')}</div>
              </div>
            </div>

            {/* Description */}
            {meal.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('Description')}</h3>
                <p className="text-gray-700 leading-relaxed">{meal.description}</p>
              </div>
            )}

            {/* Cooking Times */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-900">{t('Prep Time')}</div>
                <div className="text-2xl font-bold text-blue-600">{meal.prep_time || 0} {t('min')}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-900">{t('Cook Time')}</div>
                <div className="text-2xl font-bold text-orange-600">{meal.cook_time || 0} {t('min')}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ingredients" className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold mb-4">{t('Ingredients')}</h3>
            {meal.ingredients && meal.ingredients.length > 0 ? (
              <div className="space-y-3">
                {meal.ingredients.map((ingredient: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span>
                      <span className="ml-2">{ingredient.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">{t('No ingredients listed')}</p>
            )}
          </TabsContent>

          <TabsContent value="instructions" className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold mb-4">{t('Cooking Instructions')}</h3>
            {meal.instructions && meal.instructions.length > 0 ? (
              <div className="space-y-4">
                {meal.instructions.map((instruction: string, index: number) => (
                  <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed">{instruction}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">{t('No instructions available')}</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDialog;

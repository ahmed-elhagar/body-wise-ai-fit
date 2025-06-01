
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat, ArrowRight, Heart, Star } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import type { Meal } from "@/types/meal";

interface MealCardProps {
  meal: Meal;
  index: number;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal) => void;
}

const MealCard = ({ meal, index, onShowRecipe, onExchangeMeal }: MealCardProps) => {
  const { t, isRTL } = useI18n();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (meal.image_url) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageError(true);
      img.src = meal.image_url;
    }
  }, [meal.image_url]);

  useEffect(() => {
    setIsLiked(meal.is_liked || false);
  }, [meal.is_liked]);

  const mealImage = meal.image_url && imageLoaded && !imageError
    ? meal.image_url
    : `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center`;

  const prepTime = meal.prep_time || meal.prepTime || 0;

  return (
    <Card className="group overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={mealImage}
          alt={meal.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        
        {/* Nutrition Overview */}
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          <Badge className="bg-white/90 text-gray-800 font-semibold">
            {meal.calories} cal
          </Badge>
          <Badge className="bg-green-500/90 text-white">
            {meal.meal_type}
          </Badge>
        </div>

        {/* Meal Details Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3 text-sm">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {prepTime}min
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {meal.servings || 1}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {meal.name}
          </h3>
          {meal.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {meal.description}
            </p>
          )}
        </div>

        {/* Ingredients Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">{t('mealCard.ingredients')}</h4>
          <div className="flex flex-wrap gap-1">
            {meal.ingredients?.slice(0, 3).map((ingredient, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {ingredient.name}
              </Badge>
            ))}
            {meal.ingredients && meal.ingredients.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{meal.ingredients.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            onClick={() => onShowRecipe(meal)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ChefHat className="w-4 h-4 mr-2" />
            {t('mealCard.viewRecipe')}
          </Button>
          <Button
            onClick={() => onExchangeMeal(meal)}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MealCard;

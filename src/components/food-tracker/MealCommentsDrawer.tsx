
import React, { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Star, Utensils, Clock } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface MealCommentsDrawerProps {
  meal: {
    name: string;
    calories: number;
    protein: number;
    time: string;
  };
  children: React.ReactNode;
}

export const MealCommentsDrawer = ({ meal, children }: MealCommentsDrawerProps) => {
  const { t, isRTL } = useI18n();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);

  const handleSave = () => {
    console.log('Saving meal feedback:', { comment, rating, energy, satisfaction });
    // Here you would save to your backend
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className={`max-w-md mx-auto ${isRTL ? 'rtl' : 'ltr'}`}>
        <DrawerHeader>
          <DrawerTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <MessageSquare className="w-5 h-5 text-blue-500" />
            {t('foodTracker:mealFeedback') || 'Meal Feedback'}
          </DrawerTitle>
          <DrawerDescription className={isRTL ? 'text-right' : 'text-left'}>
            {t('foodTracker:shareMealExperience') || 'Share your experience with this meal'}
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-6 space-y-6">
          {/* Meal Info */}
          <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Utensils className="w-5 h-5 text-gray-600" />
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h4 className="font-medium">{meal.name}</h4>
              <div className={`flex gap-2 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>{meal.calories} cal</span>
                <span>{meal.protein}g protein</span>
                <span>{meal.time}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('foodTracker:overallRating') || 'Overall Rating'}
            </label>
            <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('foodTracker:energyLevel') || 'Energy Level After Meal'}
            </label>
            <div className="flex gap-2">
              {['😴', '😐', '😊', '⚡', '🚀'].map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setEnergy(index + 1)}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    energy === index + 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <span className="text-lg">{emoji}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Satisfaction */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('foodTracker:satisfaction') || 'Satisfaction Level'}
            </label>
            <div className="flex gap-2">
              {['😞', '😕', '😐', '😊', '😍'].map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setSatisfaction(index + 1)}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    satisfaction === index + 1 ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <span className="text-lg">{emoji}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('foodTracker:comments') || 'Comments'}
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('foodTracker:commentsPlaceholder') || 'How did this meal make you feel? Any notes about taste, portion size, etc.'}
              rows={3}
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            {t('foodTracker:saveFeedback') || 'Save Feedback'}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MealCommentsDrawer;

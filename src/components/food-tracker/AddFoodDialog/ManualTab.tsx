
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/hooks/useI18n';

interface ManualTabProps {
  onAddFood: (food: any) => void;
  onFoodAdded?: () => void;
  onClose?: () => void;
  preSelectedFood?: any;
}

const ManualTab = ({ onAddFood, onFoodAdded, onClose, preSelectedFood }: ManualTabProps) => {
  const { t, isRTL } = useI18n();
  const [foodData, setFoodData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    serving_size: '100',
    serving_unit: 'g'
  });

  useEffect(() => {
    if (preSelectedFood) {
      setFoodData({
        name: preSelectedFood.name || '',
        calories: preSelectedFood.calories?.toString() || '',
        protein: preSelectedFood.protein?.toString() || '',
        carbs: preSelectedFood.carbs?.toString() || '',
        fat: preSelectedFood.fat?.toString() || '',
        serving_size: preSelectedFood.serving_size?.toString() || '100',
        serving_unit: preSelectedFood.serving_unit || 'g'
      });
    }
  }, [preSelectedFood]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const food = {
      name: foodData.name,
      calories: parseFloat(foodData.calories) || 0,
      protein: parseFloat(foodData.protein) || 0,
      carbs: parseFloat(foodData.carbs) || 0,
      fat: parseFloat(foodData.fat) || 0,
      serving_size: parseFloat(foodData.serving_size) || 100,
      serving_unit: foodData.serving_unit
    };

    onAddFood(food);
    onFoodAdded?.();
    onClose?.();
  };

  const handleInputChange = (field: string, value: string) => {
    setFoodData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div>
        <Label htmlFor="food-name">{t('foodTracker:foodName') || 'Food Name'}</Label>
        <Input
          id="food-name"
          value={foodData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder={t('foodTracker:enterFoodName') || 'Enter food name'}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="serving-size">{t('foodTracker:servingSize') || 'Serving Size'}</Label>
          <Input
            id="serving-size"
            type="number"
            value={foodData.serving_size}
            onChange={(e) => handleInputChange('serving_size', e.target.value)}
            placeholder="100"
          />
        </div>
        <div>
          <Label htmlFor="serving-unit">{t('foodTracker:unit') || 'Unit'}</Label>
          <Input
            id="serving-unit"
            value={foodData.serving_unit}
            onChange={(e) => handleInputChange('serving_unit', e.target.value)}
            placeholder="g"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="calories">{t('foodTracker:calories') || 'Calories'}</Label>
          <Input
            id="calories"
            type="number"
            value={foodData.calories}
            onChange={(e) => handleInputChange('calories', e.target.value)}
            placeholder="0"
            required
          />
        </div>
        <div>
          <Label htmlFor="protein">{t('foodTracker:protein') || 'Protein (g)'}</Label>
          <Input
            id="protein"
            type="number"
            step="0.1"
            value={foodData.protein}
            onChange={(e) => handleInputChange('protein', e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="carbs">{t('foodTracker:carbs') || 'Carbs (g)'}</Label>
          <Input
            id="carbs"
            type="number"
            step="0.1"
            value={foodData.carbs}
            onChange={(e) => handleInputChange('carbs', e.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="fat">{t('foodTracker:fat') || 'Fat (g)'}</Label>
          <Input
            id="fat"
            type="number"
            step="0.1"
            value={foodData.fat}
            onChange={(e) => handleInputChange('fat', e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        {t('foodTracker:addFood') || 'Add Food'}
      </Button>
    </form>
  );
};

export default ManualTab;

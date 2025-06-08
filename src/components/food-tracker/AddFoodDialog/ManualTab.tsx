import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/hooks/useI18n';

interface ManualTabProps {
  onAddFood: (food: any) => void;
  onFoodAdded?: () => void;
  onClose?: () => void;
  preSelectedFood?: any;
}

export const ManualTab = ({ onAddFood, onFoodAdded, onClose, preSelectedFood }: ManualTabProps) => {
  const { t, isRTL } = useI18n();
  const [foodData, setFoodData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    serving: '',
    unit: 'g'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (foodData.name && foodData.calories) {
      const newFood = {
        name: foodData.name,
        calories: parseInt(foodData.calories),
        protein: parseFloat(foodData.protein) || 0,
        carbs: parseFloat(foodData.carbs) || 0,
        fat: parseFloat(foodData.fat) || 0,
        serving: parseFloat(foodData.serving) || 100,
        unit: foodData.unit
      };
      onAddFood(newFood);
      onFoodAdded?.();
      onClose?.();
      // Reset form
      setFoodData({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        serving: '',
        unit: 'g'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="space-y-2">
        <Label htmlFor="food-name">{t('foodTracker:foodName') || 'Food Name'}</Label>
        <Input
          id="food-name"
          value={foodData.name}
          onChange={(e) => setFoodData({ ...foodData, name: e.target.value })}
          placeholder={t('foodTracker:enterFoodName') || 'Enter food name'}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="serving">{t('foodTracker:serving') || 'Serving'}</Label>
          <Input
            id="serving"
            type="number"
            value={foodData.serving}
            onChange={(e) => setFoodData({ ...foodData, serving: e.target.value })}
            placeholder="100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">{t('foodTracker:unit') || 'Unit'}</Label>
          <Select value={foodData.unit} onValueChange={(value) => setFoodData({ ...foodData, unit: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="g">g</SelectItem>
              <SelectItem value="ml">ml</SelectItem>
              <SelectItem value="cup">{t('foodTracker:cup') || 'cup'}</SelectItem>
              <SelectItem value="piece">{t('foodTracker:piece') || 'piece'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="calories">{t('common:calories') || 'Calories'}</Label>
          <Input
            id="calories"
            type="number"
            value={foodData.calories}
            onChange={(e) => setFoodData({ ...foodData, calories: e.target.value })}
            placeholder="0"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="protein">{t('common:protein') || 'Protein'} (g)</Label>
          <Input
            id="protein"
            type="number"
            step="0.1"
            value={foodData.protein}
            onChange={(e) => setFoodData({ ...foodData, protein: e.target.value })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="carbs">{t('common:carbs') || 'Carbs'} (g)</Label>
          <Input
            id="carbs"
            type="number"
            step="0.1"
            value={foodData.carbs}
            onChange={(e) => setFoodData({ ...foodData, carbs: e.target.value })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fat">{t('common:fat') || 'Fat'} (g)</Label>
          <Input
            id="fat"
            type="number"
            step="0.1"
            value={foodData.fat}
            onChange={(e) => setFoodData({ ...foodData, fat: e.target.value })}
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

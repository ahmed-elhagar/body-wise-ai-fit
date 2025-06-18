
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, X, Clock, Utensils } from "lucide-react";
import { useCalorieCalculations } from '../hooks';
import { toast } from 'sonner';

interface EnhancedAddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  currentDayCalories: number | null;
  targetDayCalories: number | null;
  weeklyPlanId?: string;
  onSnackAdded?: () => void;
}

const EnhancedAddSnackDialog = ({ 
  isOpen, 
  onClose, 
  selectedDay,
  currentDayCalories,
  targetDayCalories,
  weeklyPlanId,
  onSnackAdded 
}: EnhancedAddSnackDialogProps) => {
  const [snackName, setSnackName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const calorieCalcs = useCalorieCalculations();

  const handleAddSnack = async () => {
    if (!snackName || !calories) {
      toast.error('Please fill in snack name and calories');
      return;
    }

    setIsAdding(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Snack added successfully!');
      onSnackAdded?.();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error adding snack:', error);
      toast.error('Failed to add snack');
    } finally {
      setIsAdding(false);
    }
  };

  const resetForm = () => {
    setSnackName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setPrepTime('');
    setIngredients(['']);
    setInstructions('');
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Custom Snack
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Calorie Progress Card */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Daily Calories</span>
                <span className="text-sm text-gray-600">
                  {currentDayCalories || 0} / {targetDayCalories || 2000}
                </span>
              </div>
              <Progress 
                value={calorieCalcs.percentage} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{calorieCalcs.remaining} remaining</span>
                <span>{calorieCalcs.percentage.toFixed(0)}% complete</span>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="snackName">Snack Name *</Label>
              <Input
                id="snackName"
                value={snackName}
                onChange={(e) => setSnackName(e.target.value)}
                placeholder="e.g., Apple with Peanut Butter"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories">Calories *</Label>
              <Input
                id="calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="150"
              />
            </div>
          </div>

          {/* Nutrition Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="8"
              />
            </div>
          </div>

          {/* Prep Time */}
          <div className="space-y-2">
            <Label htmlFor="prepTime" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Prep Time (minutes)
            </Label>
            <Input
              id="prepTime"
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              placeholder="5"
            />
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Ingredients
            </Label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                />
                {ingredients.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addIngredient}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Ingredient
            </Button>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Slice apple and spread peanut butter..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSnack}
              disabled={isAdding || !snackName || !calories}
              className="flex-1"
            >
              {isAdding ? 'Adding...' : 'Add Snack'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedAddSnackDialog;

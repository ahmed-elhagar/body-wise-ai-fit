
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import EnhancedLoadingIndicator from "@/components/ui/enhanced-loading-indicator";

interface AddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  weeklyPlanId: string | null;
  onSnackAdded: () => void;
  currentDayCalories: number;
  targetDayCalories: number;
}

const AddSnackDialog = ({ 
  isOpen, 
  onClose, 
  selectedDay, 
  weeklyPlanId, 
  onSnackAdded,
  currentDayCalories,
  targetDayCalories
}: AddSnackDialogProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [isGenerating, setIsGenerating] = useState(false);
  const [customSnack, setCustomSnack] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const remainingCalories = Math.max(0, targetDayCalories - currentDayCalories);

  const handleGenerateAISnack = async () => {
    if (!user || !weeklyPlanId) {
      toast.error('Missing required data');
      return;
    }

    if (remainingCalories < 50) {
      toast.error('Not enough calories remaining for a snack');
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-snack', {
        body: {
          userProfile: profile,
          day: selectedDay,
          calories: Math.min(remainingCalories, 200),
          weeklyPlanId
        }
      });

      if (error) {
        console.error('Error generating AI snack:', error);
        toast.error('Failed to generate snack');
        return;
      }

      if (data?.success) {
        toast.success('Snack added successfully!');
        onClose();
        onSnackAdded();
      } else {
        toast.error(data?.error || 'Failed to generate snack');
      }
      
    } catch (error) {
      console.error('Error generating AI snack:', error);
      toast.error('Failed to generate snack');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddCustomSnack = async () => {
    if (!customSnack.name || !customSnack.calories) {
      toast.error('Please fill in snack name and calories');
      return;
    }

    if (!weeklyPlanId) {
      toast.error('No meal plan found');
      return;
    }

    try {
      const { error } = await supabase.from('daily_meals').insert({
        weekly_plan_id: weeklyPlanId,
        day_number: selectedDay,
        meal_type: 'snack1',
        name: customSnack.name,
        calories: parseInt(customSnack.calories),
        protein: parseFloat(customSnack.protein) || 0,
        carbs: parseFloat(customSnack.carbs) || 0,
        fat: parseFloat(customSnack.fat) || 0,
        ingredients: [{ name: customSnack.name, quantity: '1', unit: 'serving' }],
        instructions: ['Enjoy as a healthy snack'],
        prep_time: 0,
        cook_time: 0,
        servings: 1
      });

      if (error) throw error;

      toast.success('Custom snack added successfully!');
      setCustomSnack({ name: '', calories: '', protein: '', carbs: '', fat: '' });
      onClose();
      onSnackAdded();
    } catch (error) {
      console.error('Error adding custom snack:', error);
      toast.error('Failed to add snack');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Snack - Day {selectedDay}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Calorie Info */}
          <div className="text-sm text-gray-600">
            <p>Remaining calories for today: <span className="font-semibold">{remainingCalories}</span></p>
          </div>

          {/* AI Generated Snack */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Generated Snack
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Let AI create a perfect snack for your remaining calories
              </p>
              
              {isGenerating ? (
                <EnhancedLoadingIndicator
                  status="loading"
                  type="ai-generation"
                  message="Generating AI Snack"
                  variant="card"
                  size="md"
                />
              ) : (
                <Button
                  onClick={handleGenerateAISnack}
                  disabled={remainingCalories < 50}
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Snack ({Math.min(remainingCalories, 200)} cal)
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Custom Snack */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Custom Snack
              </h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="snack-name">Snack Name</Label>
                  <Input
                    id="snack-name"
                    value={customSnack.name}
                    onChange={(e) => setCustomSnack(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Apple with peanut butter"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="snack-calories">Calories</Label>
                    <Input
                      id="snack-calories"
                      type="number"
                      value={customSnack.calories}
                      onChange={(e) => setCustomSnack(prev => ({ ...prev, calories: e.target.value }))}
                      placeholder="200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="snack-protein">Protein (g)</Label>
                    <Input
                      id="snack-protein"
                      type="number"
                      value={customSnack.protein}
                      onChange={(e) => setCustomSnack(prev => ({ ...prev, protein: e.target.value }))}
                      placeholder="5"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="snack-carbs">Carbs (g)</Label>
                    <Input
                      id="snack-carbs"
                      type="number"
                      value={customSnack.carbs}
                      onChange={(e) => setCustomSnack(prev => ({ ...prev, carbs: e.target.value }))}
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="snack-fat">Fat (g)</Label>
                    <Input
                      id="snack-fat"
                      type="number"
                      value={customSnack.fat}
                      onChange={(e) => setCustomSnack(prev => ({ ...prev, fat: e.target.value }))}
                      placeholder="8"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleAddCustomSnack}
                  disabled={!customSnack.name || !customSnack.calories}
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Snack
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSnackDialog;

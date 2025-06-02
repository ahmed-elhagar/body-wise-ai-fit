
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { SnackGenerationProgress } from "./add-snack/SnackGenerationProgress";

interface EnhancedAddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  weeklyPlanId?: string;
  remainingCalories: number;
  onSnackAdded: () => void;
}

export const EnhancedAddSnackDialog = ({
  isOpen,
  onClose,
  selectedDay,
  weeklyPlanId,
  remainingCalories,
  onSnackAdded
}: EnhancedAddSnackDialogProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [customSnack, setCustomSnack] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const handleGenerateAISnack = async () => {
    if (!user || !weeklyPlanId || !profile) {
      toast.error('Missing required data for snack generation');
      return;
    }

    if (remainingCalories < 50) {
      toast.error('Not enough calories remaining for a snack');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Step 1: Analyzing preferences
      setGenerationStep('analyzing');
      console.log('🔍 Step 1: Analyzing user preferences...');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Step 2: Creating perfect snack
      setGenerationStep('creating');
      console.log('🥄 Step 2: Creating perfect snack...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const targetCalories = Math.min(remainingCalories, 300);

      const { data, error } = await supabase.functions.invoke('generate-ai-snack', {
        body: {
          userProfile: profile,
          day: selectedDay,
          calories: targetCalories,
          weeklyPlanId,
          language: profile.preferred_language || 'en'
        }
      });

      if (error) {
        console.error('❌ Error generating AI snack:', error);
        throw error;
      }

      // Step 3: Saving to meal plan
      setGenerationStep('saving');
      console.log('💾 Step 3: Saving snack to meal plan...');
      await new Promise(resolve => setTimeout(resolve, 800));

      if (data?.success) {
        console.log('✅ AI snack generated successfully:', data);
        toast.success('Snack added successfully!');
        onClose();
        onSnackAdded();
      } else {
        throw new Error(data?.error || 'Failed to generate snack');
      }
      
    } catch (error: any) {
      console.error('❌ Error generating AI snack:', error);
      toast.error(error.message || 'Failed to generate snack');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
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
        meal_type: 'snack',
        name: `🍎 ${customSnack.name}`,
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
          {/* AI Generated Snack */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Generated Snack
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Let AI create a perfect snack based on your preferences and remaining calories ({remainingCalories} cal).
              </p>
              
              {isGenerating && (
                <SnackGenerationProgress step={generationStep} />
              )}
              
              <Button 
                onClick={handleGenerateAISnack}
                disabled={isGenerating}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate AI Snack'}
              </Button>
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
                    onChange={(e) => setCustomSnack({...customSnack, name: e.target.value})}
                    placeholder="e.g., Apple with peanut butter"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="calories">Calories</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={customSnack.calories}
                      onChange={(e) => setCustomSnack({...customSnack, calories: e.target.value})}
                      placeholder="200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      value={customSnack.protein}
                      onChange={(e) => setCustomSnack({...customSnack, protein: e.target.value})}
                      placeholder="5"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      value={customSnack.carbs}
                      onChange={(e) => setCustomSnack({...customSnack, carbs: e.target.value})}
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fat">Fat (g)</Label>
                    <Input
                      id="fat"
                      type="number"
                      value={customSnack.fat}
                      onChange={(e) => setCustomSnack({...customSnack, fat: e.target.value})}
                      placeholder="8"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleAddCustomSnack}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Snack
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

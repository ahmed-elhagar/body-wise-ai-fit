
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { Plus, Sparkles } from "lucide-react";

interface SnackPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  weeklyPlanId?: string;
  onSnackAdded: () => void;
}

const SnackPickerDialog = ({ 
  isOpen, 
  onClose, 
  dayNumber, 
  weeklyPlanId, 
  onSnackAdded 
}: SnackPickerDialogProps) => {
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

  const handleGenerateAISnack = async () => {
    if (!user || !weeklyPlanId) {
      toast.error('Missing required data');
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-snack', {
        body: {
          userProfile: profile,
          day: dayNumber,
          calories: 200, // Default target calories for snack
          weeklyPlanId,
          language: profile?.preferred_language || 'en'
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
        day_number: dayNumber,
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
      <DialogContent className="max-w-md bg-white border-fitness-primary-200 text-fitness-primary-800">
        <DialogHeader>
          <DialogTitle className="text-fitness-primary-800">Add Snack - Day {dayNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* AI Generated Snack */}
          <Card className="bg-fitness-primary-50 border-fitness-primary-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-fitness-primary-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-fitness-primary-500" />
                AI Generated Snack
              </h3>
              <p className="text-fitness-primary-600 text-sm mb-4">
                Let AI create a perfect snack based on your preferences and remaining calories.
              </p>
              <Button 
                onClick={handleGenerateAISnack}
                disabled={isGenerating}
                variant="default"
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate AI Snack'}
              </Button>
            </CardContent>
          </Card>

          {/* Custom Snack */}
          <Card className="bg-fitness-primary-50 border-fitness-primary-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-fitness-primary-800 mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-fitness-primary-500" />
                Custom Snack
              </h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="snack-name" className="text-fitness-primary-700">Snack Name</Label>
                  <Input
                    id="snack-name"
                    value={customSnack.name}
                    onChange={(e) => setCustomSnack({...customSnack, name: e.target.value})}
                    placeholder="e.g., Apple with peanut butter"
                    className="bg-white border-fitness-primary-300 text-fitness-primary-800"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="calories" className="text-fitness-primary-700">Calories</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={customSnack.calories}
                      onChange={(e) => setCustomSnack({...customSnack, calories: e.target.value})}
                      placeholder="200"
                      className="bg-white border-fitness-primary-300 text-fitness-primary-800"
                    />
                  </div>
                  <div>
                    <Label htmlFor="protein" className="text-fitness-primary-700">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      value={customSnack.protein}
                      onChange={(e) => setCustomSnack({...customSnack, protein: e.target.value})}
                      placeholder="5"
                      className="bg-white border-fitness-primary-300 text-fitness-primary-800"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="carbs" className="text-fitness-primary-700">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      value={customSnack.carbs}
                      onChange={(e) => setCustomSnack({...customSnack, carbs: e.target.value})}
                      placeholder="15"
                      className="bg-white border-fitness-primary-300 text-fitness-primary-800"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fat" className="text-fitness-primary-700">Fat (g)</Label>
                    <Input
                      id="fat"
                      type="number"
                      value={customSnack.fat}
                      onChange={(e) => setCustomSnack({...customSnack, fat: e.target.value})}
                      placeholder="8"
                      className="bg-white border-fitness-primary-300 text-fitness-primary-800"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleAddCustomSnack}
                  variant="default"
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

export default SnackPickerDialog;

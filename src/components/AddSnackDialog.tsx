
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface AddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  weeklyPlanId: string | null;
  onSnackAdded: () => void;
}

const AddSnackDialog = ({ isOpen, onClose, selectedDay, weeklyPlanId, onSnackAdded }: AddSnackDialogProps) => {
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [snackData, setSnackData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    ingredients: '',
    instructions: ''
  });

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAddSnack = async () => {
    if (!user || !weeklyPlanId || !snackData.name.trim()) {
      toast.error('Please fill in the snack name');
      return;
    }

    setIsAdding(true);
    
    try {
      const ingredientsArray = snackData.ingredients.split(',').map(ing => ({
        name: ing.trim(),
        quantity: '1',
        unit: 'serving'
      }));

      const instructionsArray = snackData.instructions.split(',').map(inst => inst.trim());

      const { error } = await supabase
        .from('daily_meals')
        .insert({
          weekly_plan_id: weeklyPlanId,
          day_number: selectedDay,
          meal_type: 'snack',
          name: snackData.name,
          calories: parseInt(snackData.calories) || 0,
          protein: parseFloat(snackData.protein) || 0,
          carbs: parseFloat(snackData.carbs) || 0,
          fat: parseFloat(snackData.fat) || 0,
          ingredients: ingredientsArray,
          instructions: instructionsArray,
          prep_time: 5,
          cook_time: 0,
          servings: 1
        });

      if (error) {
        console.error('Error adding snack:', error);
        toast.error('Failed to add snack');
        return;
      }

      toast.success('Snack added successfully!');
      setSnackData({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        ingredients: '',
        instructions: ''
      });
      onSnackAdded();
      onClose();
    } catch (error) {
      console.error('Error adding snack:', error);
      toast.error('Failed to add snack');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-fitness-primary" />
            Add Custom Snack to {dayNames[selectedDay - 1]}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="snack-name">Snack Name</Label>
            <Input
              id="snack-name"
              value={snackData.name}
              onChange={(e) => setSnackData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Greek Yogurt with Berries"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                value={snackData.calories}
                onChange={(e) => setSnackData(prev => ({ ...prev, calories: e.target.value }))}
                placeholder="150"
              />
            </div>
            <div>
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                value={snackData.protein}
                onChange={(e) => setSnackData(prev => ({ ...prev, protein: e.target.value }))}
                placeholder="10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                value={snackData.carbs}
                onChange={(e) => setSnackData(prev => ({ ...prev, carbs: e.target.value }))}
                placeholder="20"
              />
            </div>
            <div>
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                value={snackData.fat}
                onChange={(e) => setSnackData(prev => ({ ...prev, fat: e.target.value }))}
                placeholder="5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ingredients">Ingredients (comma separated)</Label>
            <Input
              id="ingredients"
              value={snackData.ingredients}
              onChange={(e) => setSnackData(prev => ({ ...prev, ingredients: e.target.value }))}
              placeholder="Greek yogurt, blueberries, honey"
            />
          </div>

          <div>
            <Label htmlFor="instructions">Instructions (comma separated)</Label>
            <Input
              id="instructions"
              value={snackData.instructions}
              onChange={(e) => setSnackData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Mix yogurt with berries, drizzle honey"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleAddSnack} 
              disabled={isAdding || !snackData.name.trim()}
              className="flex-1 bg-fitness-gradient text-white"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Snack
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSnackDialog;

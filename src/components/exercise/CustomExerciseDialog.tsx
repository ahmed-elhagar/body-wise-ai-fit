
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface CustomExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dailyWorkoutId: string;
  onExerciseCreated?: () => void;
}

export const CustomExerciseDialog = ({
  open,
  onOpenChange,
  dailyWorkoutId,
  onExerciseCreated
}: CustomExerciseDialogProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sets: 3,
    reps: '10',
    instructions: '',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    rest_seconds: 60,
    muscle_groups: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !dailyWorkoutId) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('exercises')
        .insert([{
          daily_workout_id: dailyWorkoutId,
          name: formData.name,
          sets: formData.sets,
          reps: formData.reps,
          instructions: formData.instructions,
          equipment: formData.equipment,
          difficulty: formData.difficulty,
          rest_seconds: formData.rest_seconds,
          muscle_groups: formData.muscle_groups,
          completed: false,
          order_number: 1
        }]);

      if (error) throw error;

      toast.success('Exercise added successfully!');
      onOpenChange(false);
      onExerciseCreated?.();
      
      // Reset form
      setFormData({
        name: '',
        sets: 3,
        reps: '10',
        instructions: '',
        equipment: 'bodyweight',
        difficulty: 'beginner',
        rest_seconds: 60,
        muscle_groups: []
      });
    } catch (error) {
      console.error('Error adding exercise:', error);
      toast.error('Failed to add exercise');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Custom Exercise</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Exercise Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Push-ups"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sets">Sets</Label>
              <Input
                id="sets"
                type="number"
                value={formData.sets}
                onChange={(e) => setFormData(prev => ({ ...prev, sets: parseInt(e.target.value) }))}
                min="1"
                max="10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reps">Reps</Label>
              <Input
                id="reps"
                value={formData.reps}
                onChange={(e) => setFormData(prev => ({ ...prev, reps: e.target.value }))}
                placeholder="e.g., 10-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment</Label>
            <Select value={formData.equipment} onValueChange={(value) => setFormData(prev => ({ ...prev, equipment: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bodyweight">Bodyweight</SelectItem>
                <SelectItem value="dumbbells">Dumbbells</SelectItem>
                <SelectItem value="barbells">Barbells</SelectItem>
                <SelectItem value="resistance_bands">Resistance Bands</SelectItem>
                <SelectItem value="machines">Machines</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Describe how to perform this exercise..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name.trim()}>
              {isSubmitting ? 'Adding...' : 'Add Exercise'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

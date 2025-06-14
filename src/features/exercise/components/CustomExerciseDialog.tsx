
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CustomExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dailyWorkoutId: string;
  onExerciseCreated: () => void;
}

const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Glutes', 'Cardio'
];

const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export const CustomExerciseDialog = ({
  open,
  onOpenChange,
  dailyWorkoutId,
  onExerciseCreated
}: CustomExerciseDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    sets: 3,
    reps: '10-12',
    rest_seconds: 60,
    instructions: '',
    difficulty: 'Intermediate',
    equipment: '',
    youtube_search_term: ''
  });
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMuscleGroup = (muscleGroup: string) => {
    if (!selectedMuscleGroups.includes(muscleGroup)) {
      setSelectedMuscleGroups([...selectedMuscleGroups, muscleGroup]);
    }
  };

  const handleRemoveMuscleGroup = (muscleGroup: string) => {
    setSelectedMuscleGroups(selectedMuscleGroups.filter(mg => mg !== muscleGroup));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Exercise name is required');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get the highest order number for this workout
      const { data: existingExercises } = await supabase
        .from('exercises')
        .select('order_number')
        .eq('daily_workout_id', dailyWorkoutId)
        .order('order_number', { ascending: false })
        .limit(1);
      
      const nextOrderNumber = existingExercises?.[0]?.order_number ? existingExercises[0].order_number + 1 : 1;

      const { error } = await supabase
        .from('exercises')
        .insert({
          daily_workout_id: dailyWorkoutId,
          name: formData.name.trim(),
          sets: formData.sets,
          reps: formData.reps,
          rest_seconds: formData.rest_seconds,
          instructions: formData.instructions.trim() || null,
          difficulty: formData.difficulty,
          equipment: formData.equipment.trim() || null,
          youtube_search_term: formData.youtube_search_term.trim() || null,
          muscle_groups: selectedMuscleGroups.length > 0 ? selectedMuscleGroups : null,
          order_number: nextOrderNumber
        });

      if (error) throw error;

      toast.success('Custom exercise added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        sets: 3,
        reps: '10-12',
        rest_seconds: 60,
        instructions: '',
        difficulty: 'Intermediate',
        equipment: '',
        youtube_search_term: ''
      });
      setSelectedMuscleGroups([]);
      
      onExerciseCreated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating exercise:', error);
      toast.error('Failed to create exercise. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Custom Exercise</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Exercise Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Push-ups, Squats, etc."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sets">Sets</Label>
              <Input
                id="sets"
                type="number"
                min="1"
                max="10"
                value={formData.sets}
                onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <Label htmlFor="reps">Reps</Label>
              <Input
                id="reps"
                value={formData.reps}
                onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                placeholder="e.g., 10-12, 30s"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rest">Rest Time (seconds)</Label>
            <Input
              id="rest"
              type="number"
              min="0"
              max="300"
              value={formData.rest_seconds}
              onChange={(e) => setFormData({ ...formData, rest_seconds: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select 
              value={formData.difficulty} 
              onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_LEVELS.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Muscle Groups</Label>
            <div className="flex flex-wrap gap-1 mb-2">
              {selectedMuscleGroups.map(muscle => (
                <Badge key={muscle} variant="default" className="text-xs">
                  {muscle}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => handleRemoveMuscleGroup(muscle)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <Select onValueChange={handleAddMuscleGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Add muscle group" />
              </SelectTrigger>
              <SelectContent>
                {MUSCLE_GROUPS.filter(mg => !selectedMuscleGroups.includes(mg)).map(muscle => (
                  <SelectItem key={muscle} value={muscle}>{muscle}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="equipment">Equipment (optional)</Label>
            <Input
              id="equipment"
              value={formData.equipment}
              onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
              placeholder="e.g., Dumbbells, Barbell, None"
            />
          </div>

          <div>
            <Label htmlFor="instructions">Instructions (optional)</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="Describe how to perform this exercise..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Adding...' : 'Add Exercise'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

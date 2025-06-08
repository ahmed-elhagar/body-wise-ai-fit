
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface CustomExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutType: 'home' | 'gym';
  onExerciseAdded: (exercise: any) => void;
}

const CustomExerciseDialog = ({ 
  open, 
  onOpenChange, 
  workoutType, 
  onExerciseAdded 
}: CustomExerciseDialogProps) => {
  const { t, isRTL } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    sets: 3,
    reps: '12',
    instructions: '',
    muscle_groups: [] as string[],
    equipment: '',
    rest_seconds: 60
  });
  const [newMuscleGroup, setNewMuscleGroup] = useState('');

  const handleAddMuscleGroup = () => {
    if (newMuscleGroup.trim() && !formData.muscle_groups.includes(newMuscleGroup.trim())) {
      setFormData(prev => ({
        ...prev,
        muscle_groups: [...prev.muscle_groups, newMuscleGroup.trim()]
      }));
      setNewMuscleGroup('');
    }
  };

  const handleRemoveMuscleGroup = (group: string) => {
    setFormData(prev => ({
      ...prev,
      muscle_groups: prev.muscle_groups.filter(g => g !== group)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      const customExercise = {
        id: `custom-${Date.now()}`,
        ...formData,
        custom: true,
        completed: false
      };
      onExerciseAdded(customExercise);
      setFormData({
        name: '',
        sets: 3,
        reps: '12',
        instructions: '',
        muscle_groups: [],
        equipment: '',
        rest_seconds: 60
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t('exercise:addCustomExercise') || 'Add Custom Exercise'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exercise-name">
                {t('exercise:exerciseName') || 'Exercise Name'}
              </Label>
              <Input
                id="exercise-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t('exercise:enterExerciseName') || 'Enter exercise name'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment">
                {t('exercise:equipment') || 'Equipment'}
              </Label>
              <Input
                id="equipment"
                value={formData.equipment}
                onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
                placeholder={t('exercise:equipmentRequired') || 'Equipment required'}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sets">
                {t('exercise:sets') || 'Sets'}
              </Label>
              <Input
                id="sets"
                type="number"
                min="1"
                value={formData.sets}
                onChange={(e) => setFormData(prev => ({ ...prev, sets: parseInt(e.target.value) || 1 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reps">
                {t('exercise:reps') || 'Reps'}
              </Label>
              <Input
                id="reps"
                value={formData.reps}
                onChange={(e) => setFormData(prev => ({ ...prev, reps: e.target.value }))}
                placeholder="e.g., 12 or 8-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rest-time">
                {t('exercise:restTime') || 'Rest Time (seconds)'}
              </Label>
              <Input
                id="rest-time"
                type="number"
                min="0"
                value={formData.rest_seconds}
                onChange={(e) => setFormData(prev => ({ ...prev, rest_seconds: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('exercise:muscleGroups') || 'Muscle Groups'}</Label>
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Input
                value={newMuscleGroup}
                onChange={(e) => setNewMuscleGroup(e.target.value)}
                placeholder={t('exercise:addMuscleGroup') || 'Add muscle group'}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMuscleGroup())}
              />
              <Button type="button" onClick={handleAddMuscleGroup}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {formData.muscle_groups.map((group, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {group}
                  <button
                    type="button"
                    onClick={() => handleRemoveMuscleGroup(group)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">
              {t('exercise:instructions') || 'Instructions'}
            </Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder={t('exercise:exerciseInstructions') || 'Enter exercise instructions...'}
              rows={3}
            />
          </div>

          <div className={`flex gap-3 justify-end ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('common:cancel') || 'Cancel'}
            </Button>
            <Button type="submit" disabled={!formData.name.trim()}>
              {t('exercise:addExercise') || 'Add Exercise'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomExerciseDialog;

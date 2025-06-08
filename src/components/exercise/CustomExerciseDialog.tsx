
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface CustomExercise {
  name: string;
  category: string;
  muscle_group: string;
  equipment: string;
  difficulty: string;
  instructions: string;
  sets: number;
  reps: string;
  rest_time: number;
}

interface CustomExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (exercise: CustomExercise) => void;
}

const CustomExerciseDialog = ({ open, onOpenChange, onSave }: CustomExerciseDialogProps) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState<CustomExercise>({
    name: '',
    category: '',
    muscle_group: '',
    equipment: '',
    difficulty: 'beginner',
    instructions: '',
    sets: 3,
    reps: '10',
    rest_time: 60
  });

  const handleSave = () => {
    if (!formData.name.trim()) return;
    onSave(formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      name: '',
      category: '',
      muscle_group: '',
      equipment: '',
      difficulty: 'beginner',
      instructions: '',
      sets: 3,
      reps: '10',
      rest_time: 60
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {t('exercise:createCustomExercise')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('exercise:exerciseName')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('exercise:enterExerciseName')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">{t('exercise:category')}</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder={t('exercise:enterCategory')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="muscle_group">{t('exercise:muscleGroup')}</Label>
              <Input
                id="muscle_group"
                value={formData.muscle_group}
                onChange={(e) => setFormData({ ...formData, muscle_group: e.target.value })}
                placeholder={t('exercise:enterMuscleGroup')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="equipment">{t('exercise:equipment')}</Label>
              <Input
                id="equipment"
                value={formData.equipment}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                placeholder={t('exercise:enterEquipment')}
              />
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label htmlFor="difficulty">{t('exercise:difficulty')}</Label>
            <Select 
              value={formData.difficulty} 
              onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">{t('exercise:beginner')}</SelectItem>
                <SelectItem value="intermediate">{t('exercise:intermediate')}</SelectItem>
                <SelectItem value="advanced">{t('exercise:advanced')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Exercise Parameters */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sets">{t('exercise:sets')}</Label>
              <Input
                id="sets"
                type="number"
                value={formData.sets}
                onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) || 0 })}
                min="1"
                max="10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reps">{t('exercise:reps')}</Label>
              <Input
                id="reps"
                value={formData.reps}
                onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                placeholder="10 or 8-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rest_time">{t('exercise:restTime')} (s)</Label>
              <Input
                id="rest_time"
                type="number"
                value={formData.rest_time}
                onChange={(e) => setFormData({ ...formData, rest_time: parseInt(e.target.value) || 0 })}
                min="10"
                max="300"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">{t('exercise:instructions')}</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder={t('exercise:enterInstructions')}
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4 mr-2" />
              {t('common:cancel')}
            </Button>
            <Button onClick={handleSave} disabled={!formData.name.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              {t('exercise:createExercise')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomExerciseDialog;

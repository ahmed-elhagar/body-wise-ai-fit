
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Plus, 
  X, 
  Dumbbell,
  Clock,
  Target,
  Activity
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CustomExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dailyWorkoutId?: string;
  onExerciseCreated?: () => void;
}

interface CustomExerciseForm {
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  instructions: string;
  equipment: string;
  difficulty: string;
  muscle_groups: string[];
  youtube_search_term: string;
}

const MUSCLE_GROUPS = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
  'abs', 'obliques', 'lower_back', 'quadriceps', 'hamstrings', 
  'glutes', 'calves', 'full_body', 'cardio'
];

const EQUIPMENT_OPTIONS = [
  'bodyweight', 'dumbbells', 'barbells', 'resistance_bands', 
  'pull_up_bar', 'bench', 'kettlebells', 'machines', 'cables',
  'yoga_mat', 'stability_ball', 'medicine_ball'
];

export const CustomExerciseDialog = ({ 
  open, 
  onOpenChange, 
  dailyWorkoutId,
  onExerciseCreated 
}: CustomExerciseDialogProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<CustomExerciseForm>({
    name: '',
    sets: 3,
    reps: '12',
    rest_seconds: 60,
    instructions: '',
    equipment: 'bodyweight',
    difficulty: 'medium',
    muscle_groups: [],
    youtube_search_term: ''
  });

  const handleAddMuscleGroup = (muscleGroup: string) => {
    if (!form.muscle_groups.includes(muscleGroup)) {
      setForm(prev => ({
        ...prev,
        muscle_groups: [...prev.muscle_groups, muscleGroup]
      }));
    }
  };

  const handleRemoveMuscleGroup = (muscleGroup: string) => {
    setForm(prev => ({
      ...prev,
      muscle_groups: prev.muscle_groups.filter(mg => mg !== muscleGroup)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !dailyWorkoutId) {
      toast.error('Missing required information');
      return;
    }

    if (!form.name.trim()) {
      toast.error('Exercise name is required');
      return;
    }

    setIsCreating(true);
    
    try {
      // Get the current exercises count to set order_number
      const { data: existingExercises } = await supabase
        .from('exercises')
        .select('order_number')
        .eq('daily_workout_id', dailyWorkoutId)
        .order('order_number', { ascending: false })
        .limit(1);

      const nextOrderNumber = existingExercises && existingExercises.length > 0 
        ? (existingExercises[0].order_number || 0) + 1 
        : 1;

      const { error } = await supabase
        .from('exercises')
        .insert({
          daily_workout_id: dailyWorkoutId,
          name: form.name.trim(),
          sets: form.sets,
          reps: form.reps,
          rest_seconds: form.rest_seconds,
          instructions: form.instructions.trim() || null,
          equipment: form.equipment,
          difficulty: form.difficulty,
          muscle_groups: form.muscle_groups,
          youtube_search_term: form.youtube_search_term.trim() || form.name.trim(),
          order_number: nextOrderNumber,
          completed: false
        });

      if (error) {
        console.error('Error creating custom exercise:', error);
        throw error;
      }

      toast.success('Custom exercise created successfully!');
      
      // Reset form
      setForm({
        name: '',
        sets: 3,
        reps: '12',
        rest_seconds: 60,
        instructions: '',
        equipment: 'bodyweight',
        difficulty: 'medium',
        muscle_groups: [],
        youtube_search_term: ''
      });

      onOpenChange(false);
      
      if (onExerciseCreated) {
        onExerciseCreated();
      }
    } catch (error) {
      console.error('Error creating custom exercise:', error);
      toast.error('Failed to create custom exercise');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            {t('Create Custom Exercise')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-blue-600" />
              {t('Basic Information')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exercise-name">{t('Exercise Name')} *</Label>
                <Input
                  id="exercise-name"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t('Enter exercise name')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube-search">{t('YouTube Search Term')}</Label>
                <Input
                  id="youtube-search"
                  value={form.youtube_search_term}
                  onChange={(e) => setForm(prev => ({ ...prev, youtube_search_term: e.target.value }))}
                  placeholder={t('Optional: custom search term')}
                />
              </div>
            </div>
          </Card>

          {/* Exercise Parameters */}
          <Card className="p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              {t('Exercise Parameters')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sets">{t('Sets')}</Label>
                <Input
                  id="sets"
                  type="number"
                  min="1"
                  max="10"
                  value={form.sets}
                  onChange={(e) => setForm(prev => ({ ...prev, sets: parseInt(e.target.value) || 1 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reps">{t('Reps')}</Label>
                <Input
                  id="reps"
                  value={form.reps}
                  onChange={(e) => setForm(prev => ({ ...prev, reps: e.target.value }))}
                  placeholder="e.g., 12, 8-12, 30s"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rest">{t('Rest (seconds)')}</Label>
                <Input
                  id="rest"
                  type="number"
                  min="0"
                  max="300"
                  value={form.rest_seconds}
                  onChange={(e) => setForm(prev => ({ ...prev, rest_seconds: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </Card>

          {/* Configuration */}
          <Card className="p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" />
              {t('Configuration')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label>{t('Equipment')}</Label>
                <Select 
                  value={form.equipment} 
                  onValueChange={(value) => setForm(prev => ({ ...prev, equipment: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT_OPTIONS.map(equipment => (
                      <SelectItem key={equipment} value={equipment}>
                        {equipment.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('Difficulty')}</Label>
                <Select 
                  value={form.difficulty} 
                  onValueChange={(value) => setForm(prev => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">{t('Beginner')}</SelectItem>
                    <SelectItem value="intermediate">{t('Intermediate')}</SelectItem>
                    <SelectItem value="advanced">{t('Advanced')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Muscle Groups */}
            <div className="space-y-2">
              <Label>{t('Target Muscle Groups')}</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.muscle_groups.map(mg => (
                  <Badge key={mg} variant="default" className="flex items-center gap-1">
                    {mg.replace('_', ' ')}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleRemoveMuscleGroup(mg)}
                    />
                  </Badge>
                ))}
              </div>
              <Select onValueChange={handleAddMuscleGroup}>
                <SelectTrigger>
                  <SelectValue placeholder={t('Add muscle group')} />
                </SelectTrigger>
                <SelectContent>
                  {MUSCLE_GROUPS.filter(mg => !form.muscle_groups.includes(mg)).map(mg => (
                    <SelectItem key={mg} value={mg}>
                      {mg.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Instructions */}
          <Card className="p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              {t('Instructions')}
            </h4>
            <Textarea
              value={form.instructions}
              onChange={(e) => setForm(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder={t('Enter detailed exercise instructions (optional)')}
              rows={3}
            />
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              {t('Cancel')}
            </Button>
            <Button
              type="submit"
              loading={isCreating}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {isCreating ? t('Creating...') : t('Create Exercise')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

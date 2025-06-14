
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";

interface CustomExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dailyWorkoutId?: string;
  onExerciseCreated: () => void;
}

export const CustomExerciseDialog = ({ 
  open, 
  onOpenChange, 
  dailyWorkoutId, 
  onExerciseCreated 
}: CustomExerciseDialogProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    sets: 3,
    reps: '10',
    rest_seconds: 60,
    instructions: '',
    muscle_groups: ['']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add custom exercise logic here
    console.log('Adding custom exercise:', formData);
    onExerciseCreated();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('Add Custom Exercise')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">{t('Exercise Name')}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sets">{t('Sets')}</Label>
              <Input
                id="sets"
                type="number"
                value={formData.sets}
                onChange={(e) => setFormData(prev => ({ ...prev, sets: parseInt(e.target.value) }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="reps">{t('Reps')}</Label>
              <Input
                id="reps"
                value={formData.reps}
                onChange={(e) => setFormData(prev => ({ ...prev, reps: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="instructions">{t('Instructions')}</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="submit">{t('Add Exercise')}</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('Cancel')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

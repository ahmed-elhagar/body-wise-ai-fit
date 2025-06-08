
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/hooks/useI18n";

interface AssignTraineeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (traineeData: any) => void;
}

export const AssignTraineeDialog = ({ open, onOpenChange, onAssign }: AssignTraineeDialogProps) => {
  const { t, isRTL } = useI18n();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    goal: "",
    notes: "",
    activityLevel: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(formData);
    setFormData({ name: "", email: "", goal: "", notes: "", activityLevel: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('coach:addNewTrainee') || 'Add New Trainee'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('common:name') || 'Name'}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">{t('common:email') || 'Email'}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goal">{t('common:goal') || 'Goal'}</Label>
            <Select value={formData.goal} onValueChange={(value) => setFormData({ ...formData, goal: value })}>
              <SelectTrigger>
                <SelectValue placeholder={t('common:selectGoal') || 'Select goal'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight-loss">{t('goals:weightLoss') || 'Weight Loss'}</SelectItem>
                <SelectItem value="muscle-gain">{t('goals:muscleGain') || 'Muscle Gain'}</SelectItem>
                <SelectItem value="maintenance">{t('goals:maintenance') || 'Maintenance'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">{t('common:notes') || 'Notes'}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t('coach:notesPlaceholder') || 'Special considerations, preferences, etc.'}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common:cancel') || 'Cancel'}
            </Button>
            <Button type="submit">
              {t('coach:assignTrainee') || 'Assign Trainee'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

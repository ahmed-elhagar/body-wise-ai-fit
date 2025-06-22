
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit3 } from "lucide-react";
import { useCoachSystem, type CoachTraineeRelationship } from "@/features/coach/hooks/useCoachSystem";
import { useLanguage } from "@/contexts/LanguageContext";

interface UpdateNotesDialogProps {
  trainee: CoachTraineeRelationship;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpdateNotesDialog = ({ trainee, open, onOpenChange }: UpdateNotesDialogProps) => {
  const { updateTraineeNotes, isUpdatingNotes } = useCoachSystem();
  const { language } = useLanguage();
  const [notes, setNotes] = useState(trainee.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateTraineeNotes(
      { traineeId: trainee.trainee_id, notes: notes.trim() },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit3 className="h-5 w-5 mr-2" />
            {language === 'ar' ? 'تحديث الملاحظات' : 'Update Notes'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trainee-info">
              {language === 'ar' ? 'المتدرب' : 'Trainee'}
            </Label>
            <p className="text-sm text-gray-600">
              {trainee.trainee_profile?.first_name} {trainee.trainee_profile?.last_name}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              {language === 'ar' ? 'الملاحظات' : 'Notes'}
            </Label>
            <Textarea
              id="notes"
              placeholder={language === 'ar' ? 
                'أضف ملاحظات حول تقدم المتدرب، أهدافه، أو أي معلومات مهمة...' : 
                'Add notes about trainee progress, goals, or any important information...'
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isUpdatingNotes}
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={isUpdatingNotes}>
              {isUpdatingNotes ? (language === 'ar' ? 'جارٍ التحديث...' : 'Updating...') : 
                               (language === 'ar' ? 'تحديث' : 'Update')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

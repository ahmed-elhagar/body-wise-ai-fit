
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus } from "lucide-react";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserSearchDropdown } from "./UserSearchDropdown";

interface AssignTraineeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AssignTraineeDialog = ({ open, onOpenChange }: AssignTraineeDialogProps) => {
  const { assignTrainee, isAssigning } = useCoachSystem();
  const { language } = useLanguage();
  const [selectedTraineeId, setSelectedTraineeId] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTraineeId) return;

    assignTrainee(selectedTraineeId, {
      onSuccess: () => {
        setSelectedTraineeId("");
        setNotes("");
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            {language === 'ar' ? 'إضافة متدرب جديد' : 'Add New Trainee'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trainee-select">
              {language === 'ar' ? 'اختر المتدرب' : 'Select Trainee'}
            </Label>
            <UserSearchDropdown
              value={selectedTraineeId}
              onValueChange={setSelectedTraineeId}
              placeholder={language === 'ar' ? 
                'ابحث واختر متدرب...' : 
                'Search and select a trainee...'
              }
              excludeRoles={['admin', 'coach']}
            />
            <p className="text-xs text-gray-500">
              {language === 'ar' ? 
                'يجب أن يكون للمتدرب حساب مُسجل في التطبيق.' :
                'The trainee must have a registered account in the app.'
              }
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              {language === 'ar' ? 'ملاحظات (اختياري)' : 'Notes (Optional)'}
            </Label>
            <Textarea
              id="notes"
              placeholder={language === 'ar' ? 
                'أضف أي ملاحظات حول المتدرب...' : 
                'Add any notes about the trainee...'
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isAssigning}
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={isAssigning || !selectedTraineeId}>
              {isAssigning ? (language === 'ar' ? 'جارٍ الإضافة...' : 'Adding...') : 
                            (language === 'ar' ? 'إضافة متدرب' : 'Add Trainee')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

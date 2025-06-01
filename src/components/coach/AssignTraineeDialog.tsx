
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Mail } from "lucide-react";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { useLanguage } from "@/contexts/LanguageContext";

interface AssignTraineeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AssignTraineeDialog = ({ open, onOpenChange }: AssignTraineeDialogProps) => {
  const { assignTrainee, isAssigning } = useCoachSystem();
  const { language } = useLanguage();
  const [traineeEmail, setTraineeEmail] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!traineeEmail.trim()) return;

    // Note: This would need to be implemented to find user by email first
    // For now, we'll pass the email as traineeId (this needs backend support)
    assignTrainee(
      { traineeId: traineeEmail.trim(), notes: notes.trim() || undefined },
      {
        onSuccess: () => {
          setTraineeEmail("");
          setNotes("");
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
            <UserPlus className="h-5 w-5 mr-2" />
            {language === 'ar' ? 'إضافة متدرب جديد' : 'Add New Trainee'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trainee-email">
              {language === 'ar' ? 'البريد الإلكتروني للمتدرب' : 'Trainee Email'}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="trainee-email"
                type="email"
                placeholder={language === 'ar' ? 
                  'أدخل البريد الإلكتروني للمتدرب' : 
                  'Enter trainee email address'
                }
                value={traineeEmail}
                onChange={(e) => setTraineeEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
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
            <Button type="submit" disabled={isAssigning || !traineeEmail.trim()}>
              {isAssigning ? (language === 'ar' ? 'جارٍ الإضافة...' : 'Adding...') : 
                            (language === 'ar' ? 'إضافة متدرب' : 'Add Trainee')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

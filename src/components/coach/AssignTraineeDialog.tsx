import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Loader2 } from "lucide-react";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { useI18n } from "@/hooks/useI18n";

interface AssignTraineeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AssignTraineeDialog = ({ open, onOpenChange }: AssignTraineeDialogProps) => {
  const { t } = useI18n();
  const { assignTrainee, isLoading } = useCoachSystem();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("trainee");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    assignTrainee(
      { email, role },
      {
        onSuccess: () => {
          setEmail("");
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
            {t('Assign Trainee')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('Trainee Email')}</Label>
            <Input
              id="email"
              placeholder={t('Trainee Email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">{t('Role')}</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trainee">{t('Trainee')}</SelectItem>
                {/* <SelectItem value="coach">Coach</SelectItem> */}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('Cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('Assigning')}...
                </>
              ) : (
                t('Assign')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

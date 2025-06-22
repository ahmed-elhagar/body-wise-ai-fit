
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCoachTasks } from "@/features/coach/hooks/useCoachTasks";
import { useLanguage } from "@/contexts/LanguageContext";
import UserSearchDropdown from "./UserSearchDropdown";

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  traineeId?: string;
  trainees?: any[];
}

const CreateTaskDialog = ({ isOpen, onClose, traineeId, trainees = [] }: CreateTaskDialogProps) => {
  const { t } = useLanguage();
  const { createTask, isCreating } = useCoachTasks();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    type: 'review' as 'review' | 'follow-up' | 'planning' | 'admin',
    traineeId: traineeId || '',
    dueDate: undefined as Date | undefined
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    createTask({
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      type: formData.type,
      traineeId: formData.traineeId || undefined,
      traineeName: undefined,
      dueDate: formData.dueDate,
      completed: false
    });

    // Reset form and close
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      type: 'review',
      traineeId: traineeId || '',
      dueDate: undefined
    });
    onClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      type: 'review',
      traineeId: traineeId || '',
      dueDate: undefined
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('Create New Task')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('Task Title')} *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={t('Enter task title...')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('Description')}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t('Enter task description...')}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('Priority')}</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: 'high' | 'medium' | 'low') => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t('Low')}</SelectItem>
                  <SelectItem value="medium">{t('Medium')}</SelectItem>
                  <SelectItem value="high">{t('High')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('Type')}</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: 'review' | 'follow-up' | 'planning' | 'admin') => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="review">{t('Review')}</SelectItem>
                  <SelectItem value="follow-up">{t('Follow-up')}</SelectItem>
                  <SelectItem value="planning">{t('Planning')}</SelectItem>
                  <SelectItem value="admin">{t('Admin')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!traineeId && (
            <div className="space-y-2">
              <Label>{t('Assign to Trainee')} ({t('Optional')})</Label>
              <UserSearchDropdown
                onSelect={(userId) => setFormData(prev => ({ ...prev, traineeId: userId }))}
                selectedUserId={formData.traineeId}
                placeholder={t('Select a trainee...')}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>{t('Due Date')} ({t('Optional')})</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(formData.dueDate, "PPP") : t('Pick a date')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('Cancel')}
            </Button>
            <Button type="submit" disabled={isCreating || !formData.title.trim()}>
              {isCreating ? t('Creating...') : t('Create Task')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;

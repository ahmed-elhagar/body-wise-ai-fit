
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCoachTasks, CoachTask } from "../hooks/useCoachTasks";
import { toast } from "sonner";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainees: any[];
}

export const CreateTaskDialog = ({ open, onOpenChange, trainees }: CreateTaskDialogProps) => {
  const { createTaskAsync, isCreating } = useCoachTasks();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as CoachTask['priority'],
    type: 'review' as CoachTask['type'],
    traineeId: 'none',
    dueDate: undefined as Date | undefined,
    dueTime: '09:00' as string,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      type: 'review',
      traineeId: 'none',
      dueDate: undefined,
      dueTime: '09:00',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    try {
      console.log('Form data before submission:', formData);
      
      // Combine date and time if both are provided
      let finalDueDate = formData.dueDate;
      if (formData.dueDate && formData.dueTime) {
        const [hours, minutes] = formData.dueTime.split(':');
        finalDueDate = new Date(formData.dueDate);
        finalDueDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      }
      
      const taskToCreate = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        type: formData.type,
        traineeId: formData.traineeId !== 'none' ? formData.traineeId : undefined,
        dueDate: finalDueDate,
        completed: false,
      };

      console.log('Creating task with data:', taskToCreate);
      
      await createTaskAsync(taskToCreate);

      console.log('Task created successfully, resetting form and closing dialog');
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task. Please try again.');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isCreating) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task or reminder for your coaching workflow.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title..."
              required
              disabled={isCreating}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description..."
              rows={3}
              disabled={isCreating}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: CoachTask['priority']) => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
                disabled={isCreating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: CoachTask['type']) => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
                disabled={isCreating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Related Trainee (Optional)</Label>
            <Select 
              value={formData.traineeId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, traineeId: value }))}
              disabled={isCreating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a trainee (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No specific trainee</SelectItem>
                {trainees.map((trainee) => (
                  <SelectItem key={trainee.trainee_id} value={trainee.trainee_id}>
                    {trainee.trainee_profile?.first_name || ''} {trainee.trainee_profile?.last_name || ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Due Date & Time (Optional)</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !formData.dueDate && "text-muted-foreground"
                    )}
                    disabled={isCreating}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
                    initialFocus
                    disabled={isCreating}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <Input
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
                  disabled={isCreating}
                  className="w-32"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isCreating ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

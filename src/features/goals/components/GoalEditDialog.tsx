
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { Goal } from "../types";
import { useGoalMutations } from "../hooks/useGoalMutations";

interface GoalEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal | null;
}

export const GoalEditDialog: React.FC<GoalEditDialogProps> = ({
  open,
  onOpenChange,
  goal
}) => {
  const { updateGoal, isUpdatingGoal } = useGoalMutations();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: '',
    currentValue: '',
    targetDate: undefined as Date | undefined,
    difficulty: 'medium',
    priority: 'medium',
    notes: ''
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        description: goal.description || '',
        targetValue: goal.target_value?.toString() || '',
        currentValue: goal.current_value?.toString() || '0',
        targetDate: goal.target_date ? new Date(goal.target_date) : undefined,
        difficulty: goal.difficulty || 'medium',
        priority: goal.priority || 'medium',
        notes: goal.notes || ''
      });
    }
  }, [goal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goal) return;

    try {
      await updateGoal({
        goalId: goal.id,
        title: formData.title,
        description: formData.description,
        targetValue: formData.targetValue ? parseFloat(formData.targetValue) : undefined,
        currentValue: formData.currentValue ? parseFloat(formData.currentValue) : undefined,
        targetDate: formData.targetDate?.toISOString().split('T')[0],
        difficulty: formData.difficulty,
        priority: formData.priority,
        notes: formData.notes
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const difficulties = [
    { value: 'easy', label: 'Easy', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'hard', label: 'Hard', color: 'text-red-600' }
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority', color: 'text-gray-600' },
    { value: 'medium', label: 'Medium Priority', color: 'text-blue-600' },
    { value: 'high', label: 'High Priority', color: 'text-red-600' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Save className="w-6 h-6 text-blue-600" />
            Edit Goal
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Goal Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Lose 10kg in 3 months"
              className="w-full"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your goal and why it's important to you..."
              rows={3}
            />
          </div>

          {/* Target and Current Values */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetValue" className="text-sm font-medium">
                Target Value
              </Label>
              <Input
                id="targetValue"
                type="number"
                value={formData.targetValue}
                onChange={(e) => setFormData(prev => ({ ...prev, targetValue: e.target.value }))}
                placeholder="e.g., 10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentValue" className="text-sm font-medium">
                Current Progress
              </Label>
              <Input
                id="currentValue"
                type="number"
                value={formData.currentValue}
                onChange={(e) => setFormData(prev => ({ ...prev, currentValue: e.target.value }))}
                placeholder="e.g., 5"
              />
            </div>
          </div>

          {/* Target Date and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.targetDate ? format(formData.targetDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.targetDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, targetDate: date }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty.value} value={difficulty.value}>
                      <span className={difficulty.color}>{difficulty.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    <span className={priority.color}>{priority.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about your goal..."
              rows={3}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUpdatingGoal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdatingGoal}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isUpdatingGoal ? (
                <>Updating...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Goal
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

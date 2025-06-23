
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Target, Plus } from "lucide-react";
import { format } from "date-fns";
import { useGoals } from "@/features/dashboard/hooks/useGoals";
import { toast } from "sonner";

interface GoalCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoalCreationDialog: React.FC<GoalCreationDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { createGoal, isCreating } = useGoals();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_type: '',
    category: '',
    target_value: '',
    target_unit: '',
    target_date: undefined as Date | undefined,
    difficulty: 'medium',
    priority: 'medium'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Goal title is required');
      return;
    }

    if (!formData.goal_type) {
      toast.error('Please select a goal type');
      return;
    }

    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    try {
      await createGoal({
        title: formData.title,
        description: formData.description,
        goal_type: formData.goal_type,
        category: formData.category,
        target_value: formData.target_value ? parseFloat(formData.target_value) : undefined,
        target_unit: formData.target_unit || undefined,
        target_date: formData.target_date?.toISOString().split('T')[0],
        difficulty: formData.difficulty,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        goal_type: '',
        category: '',
        target_value: '',
        target_unit: '',
        target_date: undefined,
        difficulty: 'medium',
        priority: 'medium'
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const goalTypes = [
    { value: 'weight_loss', label: 'Weight Loss', icon: '🔥' },
    { value: 'weight_gain', label: 'Weight Gain', icon: '💪' },
    { value: 'muscle_gain', label: 'Muscle Gain', icon: '🏋️' },
    { value: 'endurance', label: 'Endurance', icon: '🏃' },
    { value: 'strength', label: 'Strength', icon: '💯' },
    { value: 'flexibility', label: 'Flexibility', icon: '🧘' },
    { value: 'nutrition', label: 'Nutrition', icon: '🥗' },
    { value: 'habit', label: 'Habit Building', icon: '✅' },
    { value: 'custom', label: 'Custom Goal', icon: '🎯' }
  ];

  const categories = [
    { value: 'fitness', label: 'Fitness & Exercise' },
    { value: 'nutrition', label: 'Nutrition & Diet' },
    { value: 'weight', label: 'Weight Management' },
    { value: 'wellness', label: 'Health & Wellness' },
    { value: 'performance', label: 'Performance' },
    { value: 'lifestyle', label: 'Lifestyle' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'hard', label: 'Hard', color: 'text-red-600' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Target className="w-6 h-6 text-blue-600" />
            Create New Goal
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
            />
          </div>

          {/* Goal Type and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Goal Type *</Label>
              <Select
                value={formData.goal_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, goal_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select goal type" />
                </SelectTrigger>
                <SelectContent>
                  {goalTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Target Value and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_value" className="text-sm font-medium">
                Target Value
              </Label>
              <Input
                id="target_value"
                type="number"
                value={formData.target_value}
                onChange={(e) => setFormData(prev => ({ ...prev, target_value: e.target.value }))}
                placeholder="e.g., 10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_unit" className="text-sm font-medium">
                Unit
              </Label>
              <Input
                id="target_unit"
                value={formData.target_unit}
                onChange={(e) => setFormData(prev => ({ ...prev, target_unit: e.target.value }))}
                placeholder="e.g., kg, lbs, hours"
              />
            </div>
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
                    {formData.target_date ? format(formData.target_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.target_date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, target_date: date }))}
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

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isCreating ? (
                <>Creating...</>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Goal
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

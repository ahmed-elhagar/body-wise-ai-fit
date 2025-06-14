
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";

interface GoalCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GoalCreationDialog = ({ open, onOpenChange }: GoalCreationDialogProps) => {
  const { createGoal, isCreating } = useGoals();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalType: 'weight' as const,
    targetValue: 0,
    targetUnit: 'kg',
    difficulty: 'medium' as const,
    timeframe: 30
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData = {
      goal_type: formData.goalType,
      title: formData.title,
      description: formData.description,
      target_value: formData.targetValue,
      target_unit: formData.targetUnit,
      category: formData.goalType,
      difficulty: formData.difficulty,
      target_date: new Date(Date.now() + formData.timeframe * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    createGoal(goalData);
    onOpenChange(false);
    setFormData({
      title: '',
      description: '',
      goalType: 'weight',
      targetValue: 0,
      targetUnit: 'kg',
      difficulty: 'medium',
      timeframe: 30
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Create New Goal
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="goal-title">Goal Title</Label>
            <Input
              id="goal-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter your goal title"
              required
            />
          </div>

          <div>
            <Label htmlFor="goal-description">Description</Label>
            <Textarea
              id="goal-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your goal"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="goal-type">Goal Type</Label>
              <Select value={formData.goalType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, goalType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight">Weight</SelectItem>
                  <SelectItem value="calories">Calories</SelectItem>
                  <SelectItem value="protein">Protein</SelectItem>
                  <SelectItem value="carbs">Carbs</SelectItem>
                  <SelectItem value="fat">Fat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="goal-difficulty">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value: any) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target-value">Target Value</Label>
              <Input
                id="target-value"
                type="number"
                value={formData.targetValue}
                onChange={(e) => setFormData(prev => ({ ...prev, targetValue: Number(e.target.value) }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="timeframe">Timeframe (days)</Label>
              <Input
                id="timeframe"
                type="number"
                value={formData.timeframe}
                onChange={(e) => setFormData(prev => ({ ...prev, timeframe: Number(e.target.value) }))}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalCreationDialog;

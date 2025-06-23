
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { Goal } from "../types";
import { useGoalMutations } from "../hooks/useGoalMutations";

interface UpdateProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal | null;
}

export const UpdateProgressDialog: React.FC<UpdateProgressDialogProps> = ({
  open,
  onOpenChange,
  goal
}) => {
  const { updateProgress, isUpdatingProgress } = useGoalMutations();
  const [currentValue, setCurrentValue] = useState('');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (goal) {
      setCurrentValue(goal.current_value?.toString() || '0');
      setNotes('');
    }
  }, [goal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goal) return;

    try {
      await updateProgress({
        goalId: goal.id,
        currentValue: parseFloat(currentValue),
        notes: notes || undefined
      });
      
      onOpenChange(false);
      setNotes('');
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (!goal) return null;

  const newProgress = goal.target_value ? (parseFloat(currentValue) / goal.target_value) * 100 : 0;
  const clampedProgress = Math.min(Math.max(newProgress, 0), 100);
  const currentProgress = goal.target_value ? (goal.current_value / goal.target_value) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Update Progress
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Goal Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">{goal.title}</h4>
            <div className="text-sm text-gray-600">
              Target: {goal.target_value} {goal.target_unit}
            </div>
            <div className="text-sm text-gray-600">
              Current: {goal.current_value} {goal.target_unit}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Progress */}
            <div className="space-y-2">
              <Label htmlFor="currentValue" className="text-sm font-medium">
                Current Progress *
              </Label>
              <Input
                id="currentValue"
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                placeholder={`Enter value in ${goal.target_unit}`}
                step="0.1"
                required
              />
            </div>

            {/* Progress Preview */}
            {currentValue && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress Preview</span>
                  <span>{Math.round(clampedProgress)}%</span>
                </div>
                <Progress value={clampedProgress} className="h-2" />
                <div className="text-xs text-gray-500">
                  {clampedProgress > currentProgress ? 
                    `+${Math.round(clampedProgress - currentProgress)}% improvement` :
                    clampedProgress < currentProgress ?
                    `${Math.round(currentProgress - clampedProgress)}% decrease` :
                    'No change'
                  }
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this progress update..."
                rows={3}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUpdatingProgress}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdatingProgress || !currentValue}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isUpdatingProgress ? (
                  <>Updating...</>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Update Progress
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

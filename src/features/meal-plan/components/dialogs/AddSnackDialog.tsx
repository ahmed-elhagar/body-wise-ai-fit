
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { AddSnackDialogProps } from '../../types';

export const AddSnackDialog = ({
  isOpen,
  onClose,
  currentDayCalories,
  targetDayCalories,
  selectedDay,
  weeklyPlanId,
  onSnackAdded
}: AddSnackDialogProps) => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [snackType, setSnackType] = useState('healthy');
  const [customRequest, setCustomRequest] = useState('');

  const remainingCalories = Math.max(0, targetDayCalories - currentDayCalories);

  const handleGenerateSnack = async () => {
    if (!user || !weeklyPlanId) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-snack', {
        body: {
          userId: user.id,
          weeklyPlanId,
          dayNumber: selectedDay,
          snackType,
          customRequest,
          remainingCalories,
          targetCalories: Math.min(remainingCalories, 200)
        }
      });

      if (error) throw error;

      toast.success('Snack generated successfully!');
      await onSnackAdded();
      onClose();
    } catch (error: any) {
      console.error('Error generating snack:', error);
      toast.error(error.message || 'Failed to generate snack');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Healthy Snack</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              Remaining calories: <span className="font-semibold">{remainingCalories}</span>
            </p>
          </div>

          <div>
            <Label htmlFor="snack-type">Snack Type</Label>
            <Select value={snackType} onValueChange={setSnackType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="healthy">Healthy & Nutritious</SelectItem>
                <SelectItem value="protein">High Protein</SelectItem>
                <SelectItem value="energy">Energy Boosting</SelectItem>
                <SelectItem value="sweet">Sweet Treat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="custom-request">Custom Request (Optional)</Label>
            <Input
              id="custom-request"
              placeholder="e.g., nuts and fruits, low carb, quick prep..."
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleGenerateSnack} 
              className="flex-1"
              disabled={isGenerating || remainingCalories <= 0}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Snack
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

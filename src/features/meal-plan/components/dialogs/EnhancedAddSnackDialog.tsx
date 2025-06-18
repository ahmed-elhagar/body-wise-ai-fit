
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Loader2, Cookie } from "lucide-react";
import { toast } from 'sonner';

interface EnhancedAddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  currentDayCalories: number | null;
  targetDayCalories: number | null;
  weeklyPlanId?: string;
  onSnackAdded?: () => void;
}

const EnhancedAddSnackDialog = ({
  isOpen,
  onClose,
  selectedDay,
  currentDayCalories,
  targetDayCalories,
  weeklyPlanId,
  onSnackAdded
}: EnhancedAddSnackDialogProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [snackName, setSnackName] = useState('');
  const [targetCalories, setTargetCalories] = useState('');

  const remainingCalories = targetDayCalories && currentDayCalories 
    ? Math.max(0, targetDayCalories - currentDayCalories)
    : 200;

  const handleGenerateSnack = async () => {
    if (!weeklyPlanId) {
      toast.error('No meal plan selected');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Snack added successfully!');
      onSnackAdded?.();
      onClose();
      setSnackName('');
      setTargetCalories('');
    } catch (error) {
      toast.error('Failed to generate snack');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomSnack = async () => {
    if (!snackName.trim()) {
      toast.error('Please enter a snack name');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Custom snack added successfully!');
      onSnackAdded?.();
      onClose();
      setSnackName('');
      setTargetCalories('');
    } catch (error) {
      toast.error('Failed to add custom snack');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cookie className="w-5 h-5 text-orange-600" />
            Add Snack - Day {selectedDay}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Calorie Info */}
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span>Current calories:</span>
                  <span className="font-medium">{currentDayCalories || 0}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Target calories:</span>
                  <span className="font-medium">{targetDayCalories || 2000}</span>
                </div>
                <div className="flex justify-between font-medium text-orange-700">
                  <span>Remaining:</span>
                  <span>{remainingCalories} calories</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Generate Snack */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">AI Generated Snack</h3>
              <p className="text-sm text-gray-600 mb-3">
                Let AI suggest a healthy snack based on your remaining calories
              </p>
              <Button
                onClick={handleGenerateSnack}
                disabled={isGenerating}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Generate Smart Snack
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Custom Snack */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Add Custom Snack</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="snackName">Snack Name</Label>
                  <Input
                    id="snackName"
                    value={snackName}
                    onChange={(e) => setSnackName(e.target.value)}
                    placeholder="e.g., Apple with almond butter"
                  />
                </div>
                <div>
                  <Label htmlFor="targetCalories">Target Calories (optional)</Label>
                  <Input
                    id="targetCalories"
                    type="number"
                    value={targetCalories}
                    onChange={(e) => setTargetCalories(e.target.value)}
                    placeholder={`~${remainingCalories}`}
                  />
                </div>
                <Button
                  onClick={handleCustomSnack}
                  disabled={isGenerating || !snackName.trim()}
                  variant="outline"
                  className="w-full"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Add Custom Snack
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedAddSnackDialog;


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedAddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  currentDayCalories: number | null;
  targetDayCalories: number;
  weeklyPlanId?: string;
  onSnackAdded: () => void;
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
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSnack = async () => {
    if (!weeklyPlanId) {
      toast.error('No meal plan available');
      return;
    }
    
    setIsAdding(true);
    try {
      // Simulate adding snack logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Snack added successfully!');
      onSnackAdded();
      onClose();
    } catch (error) {
      console.error('❌ Add snack failed:', error);
      toast.error('Failed to add snack. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const remainingCalories = targetDayCalories - (currentDayCalories || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            Add Snack
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              Day {selectedDay} • {remainingCalories > 0 ? `${remainingCalories} calories remaining` : 'Target reached'}
            </p>
          </div>
          
          <p className="text-sm text-gray-600">
            Add a healthy snack to your meal plan that fits your nutritional goals.
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={handleAddSnack}
              disabled={isAdding}
              className="flex-1"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Snack
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedAddSnackDialog;

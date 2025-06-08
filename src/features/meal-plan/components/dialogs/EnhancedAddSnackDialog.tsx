
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface EnhancedAddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  currentDayCalories: number | null;
  targetDayCalories: number | null;
  weeklyPlanId: string | undefined;
  onSnackAdded: () => void;
}

export const EnhancedAddSnackDialog = ({ 
  isOpen, 
  onClose, 
  selectedDay,
  currentDayCalories,
  targetDayCalories,
  weeklyPlanId,
  onSnackAdded 
}: EnhancedAddSnackDialogProps) => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddSnack = async () => {
    if (!user || !weeklyPlanId) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('add-snack', {
        body: {
          weeklyPlanId,
          dayNumber: selectedDay,
          currentCalories: currentDayCalories || 0,
          targetCalories: targetDayCalories || 2000
        }
      });

      if (error) throw error;

      toast.success('Snack added successfully!');
      onSnackAdded();
      onClose();
    } catch (error) {
      console.error('Error adding snack:', error);
      toast.error('Failed to add snack');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Snack
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Add a healthy snack to your meal plan for the selected day.</p>
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddSnack} disabled={isGenerating} className="flex-1">
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Snack'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

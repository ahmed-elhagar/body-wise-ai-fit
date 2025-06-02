
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import type { DailyMeal } from '../../types';

interface ExchangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: DailyMeal | null;
  onSuccess: () => void;
}

export const ExchangeDialog = ({ isOpen, onClose, meal, onSuccess }: ExchangeDialogProps) => {
  if (!meal) return null;

  const handleExchange = () => {
    // TODO: Implement meal exchange logic
    console.log('Exchanging meal:', meal.name);
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            Exchange {meal.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Find a similar meal with comparable nutrition values.
          </p>
          
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleExchange} className="flex-1">
              Exchange Meal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

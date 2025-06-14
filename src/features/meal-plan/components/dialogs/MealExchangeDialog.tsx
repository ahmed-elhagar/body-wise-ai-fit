
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface MealExchangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: any;
  onExchangeComplete: () => void;
}

export const MealExchangeDialog = ({
  isOpen,
  onClose,
  meal,
  onExchangeComplete
}: MealExchangeDialogProps) => {
  const [isExchanging, setIsExchanging] = useState(false);

  const handleExchange = async () => {
    if (!meal) return;
    
    setIsExchanging(true);
    try {
      // Simulate meal exchange logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Meal exchanged successfully!');
      onExchangeComplete();
    } catch (error) {
      console.error('❌ Meal exchange failed:', error);
      toast.error('Failed to exchange meal. Please try again.');
    } finally {
      setIsExchanging(false);
    }
  };

  if (!meal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            Exchange Meal
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium text-gray-900">{meal.name}</h4>
            <p className="text-sm text-gray-600">
              {meal.calories} calories • {meal.meal_type}
            </p>
          </div>
          
          <p className="text-sm text-gray-600">
            Exchange this meal with an AI-generated alternative that matches your preferences and nutritional goals.
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={handleExchange}
              disabled={isExchanging}
              className="flex-1"
            >
              {isExchanging ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exchanging...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Exchange Meal
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

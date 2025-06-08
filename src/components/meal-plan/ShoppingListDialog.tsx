
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, Package, ShoppingCart } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ShoppingListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shoppingItems: {
    items: any[];
    groupedItems: Record<string, any[]>;
  };
  onSendEmail: () => Promise<boolean>;
  weekStartDate: Date;
  isLoading?: boolean;
}

const ShoppingListDialog = ({
  isOpen,
  onClose,
  shoppingItems,
  onSendEmail,
  weekStartDate,
  isLoading = false
}: ShoppingListDialogProps) => {
  const handleSendEmail = async () => {
    const success = await onSendEmail();
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping List - Week of {weekStartDate.toLocaleDateString()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {Object.entries(shoppingItems.groupedItems).map(([category, items]) => (
            <Card key={category} className="p-4">
              <h3 className="font-semibold text-lg mb-3 text-orange-600">
                {category}
              </h3>
              <div className="space-y-2">
                {items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600 text-sm">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package className="w-4 h-4" />
              Total: {shoppingItems.items.length} items
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button 
                onClick={handleSendEmail}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                {isLoading ? 'Sending...' : 'Email List'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingListDialog;

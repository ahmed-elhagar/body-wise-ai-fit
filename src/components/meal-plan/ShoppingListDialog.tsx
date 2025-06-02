
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Mail, Copy, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

interface ShoppingListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shoppingItems: {
    items: ShoppingItem[];
    groupedItems: Record<string, ShoppingItem[]>;
  };
  weekStartDate: Date;
  onSendEmail: () => Promise<boolean>;
}

const ShoppingListDialog = ({ 
  isOpen, 
  onClose, 
  shoppingItems, 
  weekStartDate,
  onSendEmail 
}: ShoppingListDialogProps) => {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    try {
      const success = await onSendEmail();
      if (success) {
        toast.success("Shopping list sent to your email!");
      }
    } catch (error) {
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleCopyToClipboard = async () => {
    let clipboardText = `Shopping List - Week of ${format(weekStartDate, 'MMM d, yyyy')}\n\n`;
    
    Object.entries(shoppingItems.groupedItems).forEach(([category, items]) => {
      clipboardText += `${category.toUpperCase()}\n`;
      items.forEach(item => {
        clipboardText += `• ${item.quantity} ${item.unit} ${item.name}\n`;
      });
      clipboardText += '\n';
    });

    try {
      await navigator.clipboard.writeText(clipboardText);
      setCopiedToClipboard(true);
      toast.success("Shopping list copied to clipboard!");
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const categoryColors = {
    'Produce': 'bg-green-100 border-green-300 text-green-800',
    'Meat & Seafood': 'bg-red-100 border-red-300 text-red-800',
    'Dairy': 'bg-blue-100 border-blue-300 text-blue-800',
    'Grains & Cereals': 'bg-yellow-100 border-yellow-300 text-yellow-800',
    'Pantry': 'bg-purple-100 border-purple-300 text-purple-800',
    'Spices & Herbs': 'bg-orange-100 border-orange-300 text-orange-800',
    'Other': 'bg-gray-100 border-gray-300 text-gray-800'
  };

  const totalItems = shoppingItems.items.length;
  const totalCategories = Object.keys(shoppingItems.groupedItems).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping List - Week of {format(weekStartDate, 'MMM d, yyyy')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{totalItems}</div>
                <div className="text-sm text-gray-600">Total Items</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-green-600">{totalCategories}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </CardContent>
            </Card>
          </div>

          {/* Shopping Items by Category */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {Object.entries(shoppingItems.groupedItems).map(([category, items]) => (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Badge className={categoryColors[category as keyof typeof categoryColors] || categoryColors['Other']}>
                        {category}
                      </Badge>
                      <span className="text-sm text-gray-500">({items.length} items)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 gap-2">
                      {items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                          <span className="font-medium">{item.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.quantity} {item.unit}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleCopyToClipboard}
              variant="outline"
              className="flex-1"
              disabled={copiedToClipboard}
            >
              {copiedToClipboard ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copiedToClipboard ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="flex-1"
            >
              <Mail className="w-4 h-4 mr-2" />
              {isSendingEmail ? 'Sending...' : 'Email List'}
            </Button>
          </div>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingListDialog;

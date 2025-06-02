
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Mail, Download } from "lucide-react";
import { useEnhancedShoppingList } from "@/hooks/useEnhancedShoppingList";
import { useState } from "react";
import type { ShoppingItem } from "@/types/shoppingList";

interface ShoppingListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingItem[];
}

const ShoppingListDialog = ({ isOpen, onClose, items }: ShoppingListDialogProps) => {
  const { sendShoppingListEmail } = useEnhancedShoppingList(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Group items by category with proper typing
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const toggleItem = (itemKey: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemKey)) {
      newChecked.delete(itemKey);
    } else {
      newChecked.add(itemKey);
    }
    setCheckedItems(newChecked);
  };

  const handleSendEmail = async () => {
    await sendShoppingListEmail();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Shopping List
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge>
                {items.length} items
              </Badge>
              <Badge>
                {Object.keys(groupedItems).length} categories
              </Badge>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleSendEmail}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            
            <Button
              onClick={() => {
                console.log('Download shopping list');
              }}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <Card key={category}>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 capitalize">{category}</h3>
                <div className="space-y-2">
                  {categoryItems.map((item, index) => {
                    const itemKey = `${category}-${index}`;
                    const isChecked = checkedItems.has(itemKey);
                    
                    return (
                      <div
                        key={itemKey}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                          isChecked ? 'bg-gray-100 line-through text-gray-500' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => toggleItem(itemKey)}
                      >
                        <span>{item.name}</span>
                        <span className="text-sm text-gray-500">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <span className="text-sm text-gray-500">
            {checkedItems.size} of {items.length} items checked
          </span>
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingListDialog;

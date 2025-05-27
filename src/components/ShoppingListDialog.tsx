
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Printer } from "lucide-react";
import { useState } from "react";

interface ShoppingItem {
  name: string;
  quantity: string;
  unit: string;
  category: string;
}

interface ShoppingListDialogProps {
  items: ShoppingItem[];
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingListDialog = ({ items, isOpen, onClose }: ShoppingListDialogProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemName: string) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(itemName)) {
      newCheckedItems.delete(itemName);
    } else {
      newCheckedItems.add(itemName);
    }
    setCheckedItems(newCheckedItems);
  };

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const categories = Object.keys(groupedItems).sort();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Weekly Shopping List
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 overflow-y-auto max-h-[60vh]">
          {categories.map((category) => (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-semibold text-fitness-primary capitalize border-b pb-1">
                {category}
              </h3>
              <div className="space-y-2">
                {groupedItems[category].map((item, index) => (
                  <div
                    key={`${category}-${index}`}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      checkedItems.has(item.name) 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={checkedItems.has(item.name)}
                        onCheckedChange={() => toggleItem(item.name)}
                      />
                      <span className={`font-medium ${
                        checkedItems.has(item.name) ? 'line-through text-gray-500' : ''
                      }`}>
                        {item.name}
                      </span>
                    </div>
                    <Badge variant="outline">
                      {item.quantity} {item.unit}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {checkedItems.size} of {items.length} items checked
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />
              Print List
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingListDialog;

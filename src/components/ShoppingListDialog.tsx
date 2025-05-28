
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Printer, Download, Share2 } from "lucide-react";
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

  const toggleCategory = (category: string) => {
    const categoryItems = groupedItems[category].map(item => item.name);
    const allChecked = categoryItems.every(item => checkedItems.has(item));
    
    const newCheckedItems = new Set(checkedItems);
    if (allChecked) {
      categoryItems.forEach(item => newCheckedItems.delete(item));
    } else {
      categoryItems.forEach(item => newCheckedItems.add(item));
    }
    setCheckedItems(newCheckedItems);
  };

  const exportList = () => {
    const listText = Object.entries(groupedItems)
      .map(([category, items]) => {
        const itemsText = items
          .map(item => `- ${item.name} (${item.quantity} ${item.unit})`)
          .join('\n');
        return `${category.toUpperCase()}\n${itemsText}`;
      })
      .join('\n\n');

    const blob = new Blob([listText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareList = async () => {
    const listText = Object.entries(groupedItems)
      .map(([category, items]) => {
        const itemsText = items
          .map(item => `• ${item.name} (${item.quantity} ${item.unit})`)
          .join('\n');
        return `${category.toUpperCase()}\n${itemsText}`;
      })
      .join('\n\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Shopping List',
          text: listText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(listText);
      // You could add a toast notification here
    }
  };

  // Group items by category with better consolidation
  const consolidatedItems = items.reduce((acc, item) => {
    const existing = acc.find(i => i.name.toLowerCase() === item.name.toLowerCase() && i.unit === item.unit);
    if (existing) {
      existing.quantity = (parseFloat(existing.quantity) + parseFloat(item.quantity)).toString();
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, [] as ShoppingItem[]);

  const groupedItems = consolidatedItems.reduce((acc, item) => {
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
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Weekly Shopping List
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={shareList}>
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={exportList}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 overflow-y-auto max-h-[60vh]">
          {categories.map((category) => {
            const categoryItems = groupedItems[category];
            const checkedCount = categoryItems.filter(item => checkedItems.has(item.name)).length;
            const allChecked = checkedCount === categoryItems.length;
            const someChecked = checkedCount > 0 && checkedCount < categoryItems.length;

            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={allChecked}
                      onCheckedChange={() => toggleCategory(category)}
                      className={someChecked ? "data-[state=checked]:bg-orange-500" : ""}
                    />
                    <h3 className="text-lg font-semibold text-fitness-primary capitalize">
                      {category}
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {checkedCount}/{categoryItems.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {categoryItems.map((item, index) => (
                    <div
                      key={`${category}-${index}`}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        checkedItems.has(item.name) 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
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
                      <Badge variant="outline" className={
                        checkedItems.has(item.name) ? 'opacity-50' : ''
                      }>
                        {item.quantity} {item.unit}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {checkedItems.size} of {consolidatedItems.length} items checked
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />
              Print
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

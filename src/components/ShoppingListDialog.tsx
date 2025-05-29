
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Printer, Download, Share2, Package, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t, isRTL } = useLanguage();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  console.log('🛒 ShoppingListDialog - Items received:', items);

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
          title: t('mealPlan.shoppingList'),
          text: listText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(listText);
    }
  };

  // Enhanced consolidation and categorization
  const consolidatedItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    
    return items.reduce((acc, item) => {
      // Ensure item has required properties
      if (!item.name || !item.quantity || !item.unit) {
        console.warn('Invalid item found:', item);
        return acc;
      }
      
      const existing = acc.find(i => 
        i.name.toLowerCase() === item.name.toLowerCase() && 
        i.unit === item.unit
      );
      
      if (existing) {
        const existingQty = parseFloat(existing.quantity) || 0;
        const newQty = parseFloat(item.quantity) || 0;
        existing.quantity = (existingQty + newQty).toString();
      } else {
        acc.push({ 
          ...item,
          category: item.category || 'Other'
        });
      }
      return acc;
    }, [] as ShoppingItem[]);
  }, [items]);

  const groupedItems = useMemo(() => {
    return consolidatedItems.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, ShoppingItem[]>);
  }, [consolidatedItems]);

  const categories = Object.keys(groupedItems).sort();
  const totalItems = consolidatedItems.length;
  const checkedCount = checkedItems.size;

  // Show empty state if no items
  if (!items || items.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`max-w-2xl max-h-[90vh] ${isRTL ? 'text-right' : 'text-left'}`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              {t('mealPlan.shoppingList')}
            </DialogTitle>
          </DialogHeader>
          
          <Card className="p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {isRTL ? 'قائمة التسوق فارغة' : 'Shopping List is Empty'}
            </h3>
            <p className="text-gray-500 mb-4">
              {isRTL ? 'أضف وجبات إلى خطتك الأسبوعية لإنشاء قائمة التسوق' : 'Add meals to your weekly plan to generate a shopping list'}
            </p>
            <Button onClick={onClose} variant="outline">
              {isRTL ? 'إغلاق' : 'Close'}
            </Button>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl max-h-[90vh] ${isRTL ? 'text-right' : 'text-left'}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <span>{t('mealPlan.shoppingList')}</span>
              <Badge variant="secondary" className="ml-2">
                {totalItems} {isRTL ? 'عنصر' : 'items'}
              </Badge>
            </div>
            <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <Button variant="outline" size="sm" onClick={shareList}>
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={exportList}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        {/* Progress Summary */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-700">
                {isRTL ? 'التقدم' : 'Progress'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {checkedCount}/{totalItems} {isRTL ? 'مكتمل' : 'completed'}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` }}
            />
          </div>
        </Card>
        
        <ScrollArea className="max-h-[50vh]">
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryItems = groupedItems[category];
              const categoryCheckedCount = categoryItems.filter(item => checkedItems.has(item.name)).length;
              const allChecked = categoryCheckedCount === categoryItems.length;
              const someChecked = categoryCheckedCount > 0 && categoryCheckedCount < categoryItems.length;

              return (
                <div key={category} className="space-y-3">
                  <div className={`flex items-center justify-between border-b pb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
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
                      {categoryCheckedCount}/{categoryItems.length}
                    </Badge>
                  </div>
                  
                  <div className="grid gap-2">
                    {categoryItems.map((item, index) => (
                      <Card
                        key={`${category}-${index}`}
                        className={`p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
                          checkedItems.has(item.name) 
                            ? 'bg-green-50 border-green-200 shadow-sm' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => toggleItem(item.name)}
                      >
                        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                            <Checkbox
                              checked={checkedItems.has(item.name)}
                              onCheckedChange={() => toggleItem(item.name)}
                            />
                            <span className={`font-medium transition-all ${
                              checkedItems.has(item.name) 
                                ? 'line-through text-gray-500' 
                                : 'text-gray-800'
                            }`}>
                              {item.name}
                            </span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`transition-all ${
                              checkedItems.has(item.name) 
                                ? 'opacity-50 bg-green-100 text-green-700' 
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {item.quantity} {item.unit}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <Separator />

        <div className={`flex justify-between items-center pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="text-sm text-gray-600">
            {checkedCount} {isRTL ? 'من' : 'of'} {totalItems} {isRTL ? 'عنصر مكتمل' : 'items completed'}
          </div>
          <div className={`flex space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />
              {isRTL ? 'طباعة' : 'Print'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              {isRTL ? 'إغلاق' : 'Close'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingListDialog;

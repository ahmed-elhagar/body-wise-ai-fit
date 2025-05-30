
import { useState, useMemo } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, ShoppingCart, Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ShoppingListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyPlan: any;
}

const ShoppingListDrawer = ({ isOpen, onClose, weeklyPlan }: ShoppingListDrawerProps) => {
  const { t } = useLanguage();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const shoppingList = useMemo(() => {
    if (!weeklyPlan?.dailyMeals) return {};

    const itemsByCategory: { [category: string]: { [item: string]: string } } = {};

    weeklyPlan.dailyMeals.forEach((meal: any) => {
      if (meal.ingredients) {
        meal.ingredients.forEach((ingredient: any) => {
          const name = typeof ingredient === 'string' ? ingredient : ingredient.name || '';
          const quantity = typeof ingredient === 'string' ? '1 unit' : ingredient.quantity || '1';
          const unit = typeof ingredient === 'string' ? '' : ingredient.unit || 'unit';
          
          if (name) {
            // Categorize ingredients
            let category = 'Other';
            if (name.toLowerCase().includes('chicken') || name.toLowerCase().includes('beef') || 
                name.toLowerCase().includes('fish') || name.toLowerCase().includes('meat')) {
              category = 'Proteins';
            } else if (name.toLowerCase().includes('apple') || name.toLowerCase().includes('banana') ||
                      name.toLowerCase().includes('orange') || name.toLowerCase().includes('berry')) {
              category = 'Fruits';
            } else if (name.toLowerCase().includes('lettuce') || name.toLowerCase().includes('tomato') ||
                      name.toLowerCase().includes('onion') || name.toLowerCase().includes('carrot')) {
              category = 'Vegetables';
            } else if (name.toLowerCase().includes('rice') || name.toLowerCase().includes('bread') ||
                      name.toLowerCase().includes('pasta') || name.toLowerCase().includes('flour')) {
              category = 'Grains & Starches';
            } else if (name.toLowerCase().includes('milk') || name.toLowerCase().includes('cheese') ||
                      name.toLowerCase().includes('yogurt') || name.toLowerCase().includes('butter')) {
              category = 'Dairy';
            }

            if (!itemsByCategory[category]) {
              itemsByCategory[category] = {};
            }

            const fullQuantity = `${quantity} ${unit}`.trim();
            if (itemsByCategory[category][name]) {
              // If item exists, you might want to combine quantities
              itemsByCategory[category][name] = fullQuantity;
            } else {
              itemsByCategory[category][name] = fullQuantity;
            }
          }
        });
      }
    });

    return itemsByCategory;
  }, [weeklyPlan]);

  const generateShoppingPdf = () => {
    // Simple PDF generation using window.print with custom styles
    const printContent = Object.entries(shoppingList).map(([category, items]) => {
      const itemList = Object.entries(items).map(([item, quantity]) => 
        `<li style="margin: 5px 0; padding: 5px; border-bottom: 1px solid #eee;">
          <span style="font-weight: 500;">${item}</span> - <span style="color: #666;">${quantity}</span>
        </li>`
      ).join('');
      
      return `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #FF6F3C; margin-bottom: 10px; font-size: 18px;">${category}</h3>
          <ul style="list-style: none; padding: 0;">${itemList}</ul>
        </div>
      `;
    }).join('');

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Shopping List</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #FF6F3C; text-align: center; }
              h3 { border-bottom: 2px solid #FF6F3C; padding-bottom: 5px; }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            <h1>🛒 Weekly Shopping List</h1>
            <p style="text-align: center; color: #666; margin-bottom: 30px;">
              Generated on ${new Date().toLocaleDateString()}
            </p>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const toggleItem = (itemKey: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemKey)) {
      newChecked.delete(itemKey);
    } else {
      newChecked.add(itemKey);
    }
    setCheckedItems(newChecked);
  };

  const categoryIcons: { [key: string]: string } = {
    'Proteins': '🥩',
    'Fruits': '🍎',
    'Vegetables': '🥕',
    'Grains & Starches': '🌾',
    'Dairy': '🥛',
    'Other': '📦'
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-[#1E1F23] border-gray-700 text-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#FF6F3C]" />
            Shopping List
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/* Export Button */}
          <Button 
            onClick={generateShoppingPdf}
            className="w-full bg-gradient-to-r from-[#FF6F3C] to-[#FF8F4C] hover:from-[#FF5F2C] hover:to-[#FF7F3C] text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>

          {/* Shopping List Categories */}
          {Object.keys(shoppingList).length > 0 ? (
            <Accordion type="multiple" className="w-full">
              {Object.entries(shoppingList).map(([category, items]) => (
                <AccordionItem key={category} value={category} className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-[#FF8F4C] transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{categoryIcons[category] || '📦'}</span>
                      {category}
                      <span className="text-sm text-gray-400 ml-2">
                        ({Object.keys(items).length} items)
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {Object.entries(items).map(([item, quantity]) => {
                        const itemKey = `${category}-${item}`;
                        const isChecked = checkedItems.has(itemKey);
                        
                        return (
                          <div 
                            key={itemKey}
                            className="flex items-center space-x-3 p-2 rounded bg-gray-800/50 hover:bg-gray-800 transition-colors"
                          >
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => toggleItem(itemKey)}
                              className="border-gray-500"
                            />
                            <div className="flex-1">
                              <span className={`font-medium ${isChecked ? 'line-through text-gray-500' : 'text-white'}`}>
                                {item}
                              </span>
                              <span className={`text-sm ml-2 ${isChecked ? 'line-through text-gray-600' : 'text-gray-400'}`}>
                                {quantity}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Card className="bg-gray-800 border-gray-600">
              <CardContent className="p-6 text-center">
                <Package className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No shopping list available</p>
                <p className="text-sm text-gray-500 mt-1">
                  Generate a meal plan to create your shopping list
                </p>
              </CardContent>
            </Card>
          )}

          {/* Progress Summary */}
          {Object.keys(shoppingList).length > 0 && (
            <Card className="bg-gray-800 border-gray-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Progress</span>
                  <span className="text-[#FF6F3C] font-medium">
                    {checkedItems.size} / {Object.values(shoppingList).reduce((total, items) => total + Object.keys(items).length, 0)} items
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingListDrawer;


import { useState, useMemo, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Download, ShoppingCart, Package, Loader2, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { DailyMeal } from "@/hooks/useMealPlanData";

interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

interface ShoppingListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyPlan: { dailyMeals: DailyMeal[] } | null;
}

const ShoppingListDrawer = ({ isOpen, onClose, weeklyPlan }: ShoppingListDrawerProps) => {
  const { t, isRTL } = useLanguage();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Process ingredients from meal plan data
  const { shoppingItems, groupedItems } = useMemo(() => {
    if (!weeklyPlan?.dailyMeals) {
      return { shoppingItems: [], groupedItems: {} };
    }

    setIsLoading(true);
    
    const itemsMap = new Map<string, ShoppingItem>();

    weeklyPlan.dailyMeals.forEach((meal) => {
      if (meal.ingredients && Array.isArray(meal.ingredients)) {
        meal.ingredients.forEach((ingredient) => {
          if (!ingredient?.name) return;

          const key = `${ingredient.name.toLowerCase()}-${ingredient.unit || 'piece'}`;
          const category = categorizeIngredient(ingredient.name);
          const quantity = parseFloat(ingredient.quantity) || 1;

          if (itemsMap.has(key)) {
            // Sum quantities for same ingredient
            const existing = itemsMap.get(key)!;
            existing.quantity += quantity;
          } else {
            itemsMap.set(key, {
              name: ingredient.name,
              quantity,
              unit: ingredient.unit || 'piece',
              category
            });
          }
        });
      }
    });

    const items = Array.from(itemsMap.values());
    
    // Group by category
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ShoppingItem[]>);

    setTimeout(() => setIsLoading(false), 300);

    return { shoppingItems: items, groupedItems: grouped };
  }, [weeklyPlan]);

  const categorizeIngredient = (ingredientName: string): string => {
    const name = ingredientName.toLowerCase();
    
    // Protein sources
    if (name.includes('chicken') || name.includes('beef') || name.includes('fish') || 
        name.includes('salmon') || name.includes('tuna') || name.includes('shrimp') ||
        name.includes('turkey') || name.includes('pork') || name.includes('lamb') ||
        name.includes('egg') || name.includes('tofu')) {
      return isRTL ? 'البروتينات' : 'Proteins';
    }
    
    // Dairy
    if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt') || 
        name.includes('cream') || name.includes('butter')) {
      return isRTL ? 'منتجات الألبان' : 'Dairy';
    }
    
    // Vegetables
    if (name.includes('tomato') || name.includes('onion') || name.includes('garlic') || 
        name.includes('pepper') || name.includes('carrot') || name.includes('broccoli') ||
        name.includes('spinach') || name.includes('lettuce') || name.includes('cucumber') ||
        name.includes('potato') || name.includes('celery') || name.includes('mushroom')) {
      return isRTL ? 'الخضراوات' : 'Vegetables';
    }
    
    // Fruits
    if (name.includes('apple') || name.includes('banana') || name.includes('orange') || 
        name.includes('berry') || name.includes('lemon') || name.includes('lime') ||
        name.includes('grape') || name.includes('avocado')) {
      return isRTL ? 'الفواكه' : 'Fruits';
    }
    
    // Grains & Carbs
    if (name.includes('rice') || name.includes('bread') || name.includes('pasta') || 
        name.includes('oats') || name.includes('quinoa') || name.includes('flour') ||
        name.includes('cereal') || name.includes('noodle')) {
      return isRTL ? 'الحبوب والكربوهيدرات' : 'Grains & Carbs';
    }
    
    // Spices & Seasonings
    if (name.includes('salt') || name.includes('pepper') || name.includes('oregano') || 
        name.includes('basil') || name.includes('cinnamon') || name.includes('cumin') ||
        name.includes('paprika') || name.includes('thyme') || name.includes('rosemary')) {
      return isRTL ? 'التوابل والبهارات' : 'Spices & Seasonings';
    }
    
    // Oils & Fats
    if (name.includes('oil') || name.includes('olive') || name.includes('coconut oil') ||
        name.includes('vegetable oil')) {
      return isRTL ? 'الزيوت والدهون' : 'Oils & Fats';
    }
    
    return isRTL ? 'أخرى' : 'Other';
  };

  const generateShoppingPdf = () => {
    const categories = Object.keys(groupedItems).sort();
    
    const listContent = categories.map(category => {
      const items = groupedItems[category];
      const itemsText = items
        .map(item => `• ${item.name} - ${item.quantity} ${item.unit}`)
        .join('\n');
      return `${category.toUpperCase()}\n${itemsText}`;
    }).join('\n\n');

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Shopping List</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                direction: ${isRTL ? 'rtl' : 'ltr'};
                text-align: ${isRTL ? 'right' : 'left'};
              }
              h1 { color: #FF6F3C; text-align: center; margin-bottom: 20px; }
              h3 { 
                color: #FF6F3C; 
                border-bottom: 2px solid #FF6F3C; 
                padding-bottom: 5px; 
                margin-top: 20px;
              }
              .item { margin: 8px 0; padding: 8px; border-bottom: 1px solid #eee; }
              .meta { 
                text-align: center; 
                color: #666; 
                margin-bottom: 30px; 
                font-size: 14px;
              }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            <h1>🛒 ${isRTL ? 'قائمة التسوق الأسبوعية' : 'Weekly Shopping List'}</h1>
            <p class="meta">
              ${isRTL ? 'تم إنشاؤها في' : 'Generated on'} ${new Date().toLocaleDateString(isRTL ? 'ar' : 'en')}
            </p>
            <div style="white-space: pre-line;">${listContent}</div>
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

  const toggleCategory = (category: string) => {
    const categoryItems = groupedItems[category]?.map(item => `${item.name}-${item.category}`) || [];
    const allChecked = categoryItems.every(item => checkedItems.has(item));
    
    const newChecked = new Set(checkedItems);
    if (allChecked) {
      categoryItems.forEach(item => newChecked.delete(item));
    } else {
      categoryItems.forEach(item => newChecked.add(item));
    }
    setCheckedItems(newChecked);
  };

  const categories = Object.keys(groupedItems).sort();
  const totalItems = shoppingItems.length;
  const checkedCount = checkedItems.size;

  const categoryIcons: Record<string, string> = {
    'Proteins': '🥩',
    'البروتينات': '🥩',
    'Dairy': '🥛',
    'منتجات الألبان': '🥛',
    'Vegetables': '🥕',
    'الخضراوات': '🥕',
    'Fruits': '🍎',
    'الفواكه': '🍎',
    'Grains & Carbs': '🌾',
    'الحبوب والكربوهيدرات': '🌾',
    'Spices & Seasonings': '🧂',
    'التوابل والبهارات': '🧂',
    'Oils & Fats': '🫒',
    'الزيوت والدهون': '🫒',
    'Other': '📦',
    'أخرى': '📦'
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-[#1E1F23] border-gray-700 text-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#FF6F3C]" />
            {isRTL ? 'قائمة التسوق' : 'Shopping List'}
            {totalItems > 0 && (
              <Badge className="bg-[#FF6F3C] text-white ml-2">
                {totalItems} {isRTL ? 'عنصر' : 'items'}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/* Export Button */}
          {totalItems > 0 && (
            <Button 
              onClick={generateShoppingPdf}
              className="w-full bg-gradient-to-r from-[#FF6F3C] to-[#FF8F4C] hover:from-[#FF5F2C] hover:to-[#FF7F3C] text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              {isRTL ? 'تصدير PDF' : 'Export PDF'}
            </Button>
          )}

          {/* Loading State */}
          {isLoading && (
            <Card className="bg-gray-800 border-gray-600">
              <CardContent className="p-6 text-center">
                <Loader2 className="w-8 h-8 text-[#FF6F3C] mx-auto mb-3 animate-spin" />
                <p className="text-gray-400">
                  {isRTL ? 'جاري تحضير قائمة التسوق...' : 'Preparing shopping list...'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!isLoading && totalItems === 0 && (
            <Card className="bg-gray-800 border-gray-600">
              <CardContent className="p-6 text-center">
                <Package className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">
                  {isRTL ? 'قائمة التسوق فارغة' : 'No shopping list available'}
                </p>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'أنشئ خطة وجبات لإنشاء قائمة التسوق' : 'Generate a meal plan to create your shopping list'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Shopping List Categories */}
          {!isLoading && totalItems > 0 && (
            <>
              {/* Progress Summary */}
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">
                      {isRTL ? 'التقدم' : 'Progress'}
                    </span>
                    <span className="text-[#FF6F3C] font-medium">
                      {checkedCount} / {totalItems} {isRTL ? 'مكتمل' : 'completed'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#FF6F3C] to-[#FF8F4C] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Accordion type="multiple" className="w-full">
                {categories.map((category) => {
                  const categoryItems = groupedItems[category];
                  const categoryCheckedCount = categoryItems.filter(item => 
                    checkedItems.has(`${item.name}-${item.category}`)
                  ).length;
                  const allChecked = categoryCheckedCount === categoryItems.length;

                  return (
                    <AccordionItem key={category} value={category} className="border-gray-700">
                      <AccordionTrigger className="text-white hover:text-[#FF8F4C] transition-colors">
                        <div className="flex items-center gap-2 flex-1">
                          <Checkbox
                            checked={allChecked}
                            onCheckedChange={() => toggleCategory(category)}
                            onClick={(e) => e.stopPropagation()}
                            className="border-gray-500"
                          />
                          <span className="text-lg">{categoryIcons[category] || '📦'}</span>
                          <span className="flex-1 text-left">{category}</span>
                          <Badge variant="outline" className="text-xs border-gray-500">
                            {categoryCheckedCount}/{categoryItems.length}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          {categoryItems.map((item, index) => {
                            const itemKey = `${item.name}-${item.category}`;
                            const isChecked = checkedItems.has(itemKey);
                            
                            return (
                              <div 
                                key={`${category}-${index}`}
                                className="flex items-center space-x-3 p-2 rounded bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer"
                                onClick={() => toggleItem(itemKey)}
                              >
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() => toggleItem(itemKey)}
                                  className="border-gray-500"
                                />
                                <div className="flex-1">
                                  <span className={`font-medium ${isChecked ? 'line-through text-gray-500' : 'text-white'}`}>
                                    {item.name}
                                  </span>
                                  <span className={`text-sm ml-2 ${isChecked ? 'line-through text-gray-600' : 'text-gray-400'}`}>
                                    {item.quantity} {item.unit}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingListDrawer;

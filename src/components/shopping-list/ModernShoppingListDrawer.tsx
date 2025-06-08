
import { useState, useMemo, useCallback } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShoppingCart, X, Mail, Plus, Minus, CheckCircle2, Circle, Package } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/hooks/useI18n";
import { getCategoryForIngredient } from "@/utils/mealPlanUtils";
import type { WeeklyMealPlan, DailyMeal } from "@/hooks/useMealPlanData";

interface ShoppingListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyPlan?: {
    weeklyPlan: WeeklyMealPlan;
    dailyMeals: DailyMeal[];
  } | null;
  weekId?: string;
  onShoppingListUpdate?: () => void;
}

interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

const ModernShoppingListDrawer = ({ 
  isOpen, 
  onClose, 
  weeklyPlan, 
  weekId,
  onShoppingListUpdate 
}: ShoppingListDrawerProps) => {
  const { t, isRTL } = useI18n();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isEmailSending, setIsEmailSending] = useState(false);

  // Compute shopping list from meal plan data with proper aggregation
  const shoppingItems = useMemo(() => {
    console.log('🛒 Computing modern shopping list from meal plan data...');
    
    if (!weeklyPlan?.dailyMeals) {
      return [];
    }

    const itemsMap = new Map<string, ShoppingItem>();
    
    weeklyPlan.dailyMeals.forEach(meal => {
      if (meal.ingredients && Array.isArray(meal.ingredients)) {
        meal.ingredients.forEach((ingredient: any) => {
          const ingredientName = ingredient.name || ingredient;
          const quantity = parseFloat(ingredient.quantity || '1');
          const unit = ingredient.unit || 'piece';
          const key = `${ingredientName.toLowerCase()}-${unit}`;
          
          if (itemsMap.has(key)) {
            const existing = itemsMap.get(key)!;
            existing.quantity += quantity;
          } else {
            itemsMap.set(key, {
              name: ingredientName,
              quantity: quantity,
              unit: unit,
              category: getCategoryForIngredient(ingredientName)
            });
          }
        });
      }
    });

    const items = Array.from(itemsMap.values());
    console.log('🛒 Generated modern shopping items:', items.length);
    return items;
  }, [weeklyPlan?.dailyMeals]);

  // Group items by category
  const groupedItems = useMemo(() => {
    return shoppingItems.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, ShoppingItem[]>);
  }, [shoppingItems]);

  const toggleItem = useCallback((itemKey: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
      } else {
        newSet.add(itemKey);
      }
      return newSet;
    });
    onShoppingListUpdate?.();
  }, [onShoppingListUpdate]);

  const toggleCategory = useCallback((category: string) => {
    const categoryItems = groupedItems[category]?.map(item => `${item.name}-${item.category}`) || [];
    const allChecked = categoryItems.every(item => checkedItems.has(item));
    
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (allChecked) {
        categoryItems.forEach(item => newSet.delete(item));
      } else {
        categoryItems.forEach(item => newSet.add(item));
      }
      return newSet;
    });
    onShoppingListUpdate?.();
  }, [groupedItems, checkedItems, onShoppingListUpdate]);

  const sendEmail = useCallback(async () => {
    setIsEmailSending(true);
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(t('Shopping list sent to email successfully!'));
      onShoppingListUpdate?.();
    } catch (error) {
      toast.error(t('Failed to send email'));
    } finally {
      setIsEmailSending(false);
    }
  }, [t, onShoppingListUpdate]);

  const isLoading = !weeklyPlan;
  const isEmpty = shoppingItems.length === 0 && !!weeklyPlan;
  const completedCount = checkedItems.size;
  const progressPercentage = shoppingItems.length > 0 ? (completedCount / shoppingItems.length) * 100 : 0;

  const categories = Object.keys(groupedItems).sort();

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

  if (isLoading) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent 
          side={isRTL ? "left" : "right"} 
          className="w-full sm:max-w-lg bg-gradient-to-br from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200 overflow-y-auto z-[100]"
        >
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Package className="w-12 h-12 text-fitness-primary-400 mx-auto mb-4 animate-pulse" />
              <p className="text-fitness-primary-600">{t('Loading shopping list...')}</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (isEmpty) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent 
          side={isRTL ? "left" : "right"} 
          className="w-full sm:max-w-lg bg-gradient-to-br from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200 overflow-y-auto z-[100]"
        >
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <ShoppingCart className="w-16 h-16 text-fitness-primary-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-fitness-primary-700 mb-2">{t('No Shopping List')}</h3>
              <p className="text-fitness-primary-600">{t('Generate a meal plan first to create your shopping list.')}</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isRTL ? "left" : "right"} 
        className="w-full sm:max-w-lg bg-gradient-to-br from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200 overflow-y-auto z-[100]"
      >
        <div className="space-y-6 h-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-fitness-primary-800">{t('Shopping List')}</h2>
                <p className="text-sm text-fitness-primary-600">
                  {shoppingItems.length} {t('items')} • {categories.length} {t('categories')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={sendEmail}
                disabled={isEmailSending}
                size="sm"
                variant="outline"
                className="border-fitness-primary-300 text-fitness-primary-600 hover:bg-fitness-primary-50"
              >
                <Mail className="w-4 h-4" />
              </Button>
              <Button onClick={onClose} size="sm" variant="ghost">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress */}
          <Card className="bg-white/80 backdrop-blur-sm border-fitness-primary-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-fitness-primary-700">{t('Progress')}</span>
                <span className="text-sm text-fitness-primary-600">{completedCount}/{shoppingItems.length}</span>
              </div>
              <div className="w-full bg-fitness-primary-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-fitness-primary-500 to-fitness-accent-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <div className="flex-1 overflow-y-auto">
            <Accordion type="multiple" className="space-y-3">
              {categories.map((category) => {
                const categoryItems = groupedItems[category];
                const categoryCheckedCount = categoryItems.filter(item => 
                  checkedItems.has(`${item.name}-${item.category}`)
                ).length;
                const allChecked = categoryCheckedCount === categoryItems.length;

                return (
                  <AccordionItem key={category} value={category} className="bg-white/80 backdrop-blur-sm rounded-lg border-fitness-primary-200 shadow-md">
                    <AccordionTrigger className="text-fitness-primary-700 hover:text-fitness-accent-600 transition-colors px-4 py-3 font-medium">
                      <div className="flex items-center gap-3 flex-1">
                        <Checkbox
                          checked={allChecked}
                          onCheckedChange={() => toggleCategory(category)}
                          onClick={(e) => e.stopPropagation()}
                          className="border-fitness-primary-300 data-[state=checked]:bg-fitness-primary-500 data-[state=checked]:border-fitness-primary-500"
                        />
                        <span className="text-xl">{categoryIcons[category] || '📦'}</span>
                        <span className="flex-1 text-left font-semibold">{category}</span>
                        <Badge className="bg-fitness-primary-100 text-fitness-primary-700 border-fitness-primary-200">
                          {categoryCheckedCount}/{categoryItems.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-2 pt-2">
                        {categoryItems.map((item, index) => {
                          const itemKey = `${item.name}-${item.category}`;
                          const isChecked = checkedItems.has(itemKey);
                          
                          return (
                            <div
                              key={`${category}-${index}`}
                              className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:shadow-sm ${
                                isChecked 
                                  ? 'bg-fitness-primary-50 border-fitness-primary-200 opacity-60' 
                                  : 'bg-white border-fitness-primary-100 hover:border-fitness-primary-200'
                              }`}
                              onClick={() => toggleItem(itemKey)}
                            >
                              <Checkbox
                                checked={isChecked}
                                className="border-fitness-primary-300 data-[state=checked]:bg-fitness-primary-500 data-[state=checked]:border-fitness-primary-500"
                              />
                              <div className="flex-1">
                                <span className={`font-medium ${isChecked ? 'line-through text-fitness-primary-500' : 'text-fitness-primary-800'}`}>
                                  {item.name}
                                </span>
                                <div className="text-sm text-fitness-primary-600">
                                  {item.quantity} {item.unit}
                                </div>
                              </div>
                              {isChecked ? (
                                <CheckCircle2 className="w-5 h-5 text-fitness-primary-500" />
                              ) : (
                                <Circle className="w-5 h-5 text-fitness-primary-300" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ModernShoppingListDrawer;

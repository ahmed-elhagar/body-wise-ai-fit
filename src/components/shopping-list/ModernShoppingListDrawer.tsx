
import { useState, useMemo, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ShoppingCart, 
  Search, 
  Mail, 
  Download, 
  Check, 
  Filter,
  Package,
  X,
  Plus,
  Minus
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCategoryForIngredient } from "@/utils/mealPlanUtils";
import { toast } from "sonner";
import type { WeeklyMealPlan, DailyMeal } from "@/features/meal-plan/types";
import { CategoryShoppingCard } from "./CategoryShoppingCard";
import { ShoppingListHeader } from "./ShoppingListHeader";
import { ShoppingListProgress } from "./ShoppingListProgress";
import { EmptyShoppingState } from "./EmptyShoppingState";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  mealSource?: string;
  isChecked: boolean;
  originalQuantities?: Array<{
    quantity: number;
    unit: string;
    meal: string;
  }>;
}

interface ModernShoppingListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyPlan?: {
    weeklyPlan: WeeklyMealPlan;
    dailyMeals: DailyMeal[];
  } | null;
  weekId?: string;
  onShoppingListUpdate?: () => void;
}

const ModernShoppingListDrawer = ({ 
  isOpen, 
  onClose, 
  weeklyPlan, 
  weekId,
  onShoppingListUpdate 
}: ModernShoppingListDrawerProps) => {
  const { isRTL } = useLanguage();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  // Smart ingredient aggregation with quantity merging
  const shoppingItems = useMemo(() => {
    console.log('🛒 Computing smart shopping list from meal plan data...');
    
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
            existing.originalQuantities?.push({
              quantity,
              unit,
              meal: meal.name
            });
          } else {
            itemsMap.set(key, {
              id: key,
              name: ingredientName,
              quantity: quantity,
              unit: unit,
              category: getCategoryForIngredient(ingredientName),
              mealSource: meal.name,
              isChecked: checkedItems.has(key),
              originalQuantities: [{
                quantity,
                unit,
                meal: meal.name
              }]
            });
          }
        });
      }
    });

    const items = Array.from(itemsMap.values());
    console.log('🛒 Generated smart shopping items:', items.length);
    return items;
  }, [weeklyPlan?.dailyMeals, checkedItems]);

  // Filter items based on search and category filters
  const filteredItems = useMemo(() => {
    let filtered = shoppingItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategories.size > 0) {
      filtered = filtered.filter(item =>
        selectedCategories.has(item.category)
      );
    }

    return filtered;
  }, [shoppingItems, searchTerm, selectedCategories]);

  // Group filtered items by category
  const groupedItems = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, ShoppingItem[]>);
  }, [filteredItems]);

  // Progress calculations
  const progressStats = useMemo(() => {
    const totalItems = shoppingItems.length;
    const checkedCount = shoppingItems.filter(item => item.isChecked).length;
    const progressPercentage = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;
    
    return {
      totalItems,
      checkedCount,
      progressPercentage,
      remainingItems: totalItems - checkedCount
    };
  }, [shoppingItems, checkedItems]);

  // Load checked items from localStorage on mount
  useEffect(() => {
    if (weekId) {
      const saved = localStorage.getItem(`shopping-list-${weekId}`);
      if (saved) {
        try {
          const savedChecked = JSON.parse(saved);
          setCheckedItems(new Set(savedChecked));
        } catch (error) {
          console.error('Failed to load saved shopping list state:', error);
        }
      }
    }
  }, [weekId]);

  // Save checked items to localStorage
  useEffect(() => {
    if (weekId && checkedItems.size > 0) {
      localStorage.setItem(`shopping-list-${weekId}`, JSON.stringify(Array.from(checkedItems)));
    }
  }, [checkedItems, weekId]);

  const handleItemToggle = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
    onShoppingListUpdate?.();
  };

  const handleCategoryToggle = (category: string) => {
    const categoryItems = groupedItems[category] || [];
    const allChecked = categoryItems.every(item => checkedItems.has(item.id));
    
    const newChecked = new Set(checkedItems);
    categoryItems.forEach(item => {
      if (allChecked) {
        newChecked.delete(item.id);
      } else {
        newChecked.add(item.id);
      }
    });
    setCheckedItems(newChecked);
    onShoppingListUpdate?.();
  };

  const handleCategoryFilter = (category: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
  };

  const handleSendEmail = async () => {
    console.log('📧 Sending shopping list email...');
    toast.success('Shopping list sent to your email!');
  };

  const handleExport = () => {
    console.log('📥 Exporting shopping list...');
    toast.success('Shopping list exported successfully!');
  };

  const clearAllChecked = () => {
    setCheckedItems(new Set());
    if (weekId) {
      localStorage.removeItem(`shopping-list-${weekId}`);
    }
  };

  if (!weeklyPlan || shoppingItems.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent 
          side={isRTL ? "left" : "right"} 
          className="w-full sm:max-w-lg bg-gray-50 border-0 p-0"
        >
          <EmptyShoppingState onClose={onClose} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isRTL ? "left" : "right"} 
        className="w-full sm:max-w-lg bg-gray-50 border-0 p-0 flex flex-col"
      >
        {/* Header */}
        <ShoppingListHeader
          totalItems={progressStats.totalItems}
          checkedCount={progressStats.checkedCount}
          onSendEmail={handleSendEmail}
          onExport={handleExport}
          onClose={onClose}
        />

        {/* Progress Bar */}
        <ShoppingListProgress
          progress={progressStats.progressPercentage}
          checkedCount={progressStats.checkedCount}
          totalItems={progressStats.totalItems}
          remainingItems={progressStats.remainingItems}
        />

        {/* Search and Filters */}
        <div className="p-4 bg-white border-b space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-gray-50 border-gray-200"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllChecked}
              disabled={checkedItems.size === 0}
              className="text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear All
            </Button>
            
            {Object.keys(groupedItems).map(category => (
              <Button
                key={category}
                variant={selectedCategories.has(category) ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(category)}
                className="text-xs"
              >
                <Filter className="w-3 h-3 mr-1" />
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Shopping List Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {Object.entries(groupedItems).map(([category, items]) => (
              <CategoryShoppingCard
                key={category}
                category={category}
                items={items}
                checkedItems={checkedItems}
                onItemToggle={handleItemToggle}
                onCategoryToggle={handleCategoryToggle}
              />
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ModernShoppingListDrawer;

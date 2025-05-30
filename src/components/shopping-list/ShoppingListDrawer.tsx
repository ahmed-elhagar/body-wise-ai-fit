
import { useState, useMemo, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle
} from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import DrawerHeader from "./DrawerHeader";
import CategoryAccordion from "./CategoryAccordion";
import ProgressFooter from "./ProgressFooter";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
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
  weekId?: string;
  onShoppingListUpdate?: () => void;
}

const ShoppingListDrawer = ({ 
  isOpen, 
  onClose, 
  weeklyPlan, 
  weekId,
  onShoppingListUpdate 
}: ShoppingListDrawerProps) => {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Memoized ingredient aggregation for performance
  const { shoppingItems, groupedItems } = useMemo(() => {
    console.log('🔄 Computing shopping list from meal plan data...');
    const startTime = performance.now();
    
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

    const endTime = performance.now();
    console.log(`✅ Shopping list computed in ${(endTime - startTime).toFixed(2)}ms`);

    setTimeout(() => setIsLoading(false), 300);

    return { shoppingItems: items, groupedItems: grouped };
  }, [weeklyPlan]);

  // Load persisted progress from localStorage
  useEffect(() => {
    if (user && weekId && shoppingItems.length > 0) {
      const storageKey = `shopping-progress-${user.id}-${weekId}`;
      const savedProgress = localStorage.getItem(storageKey);
      
      if (savedProgress) {
        try {
          const parsedProgress = JSON.parse(savedProgress);
          setCheckedItems(new Set(parsedProgress));
          console.log('📱 Rehydrated shopping list progress from localStorage');
        } catch (error) {
          console.error('Error parsing saved progress:', error);
        }
      }
    }
  }, [user, weekId, shoppingItems.length]);

  // Save progress to localStorage whenever checkedItems changes
  useEffect(() => {
    if (user && weekId && checkedItems.size > 0) {
      const storageKey = `shopping-progress-${user.id}-${weekId}`;
      localStorage.setItem(storageKey, JSON.stringify(Array.from(checkedItems)));
    }
  }, [checkedItems, user, weekId]);

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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const totalItems = shoppingItems.length;
  const checkedCount = checkedItems.size;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        className="w-full sm:max-w-lg bg-[#1E1F23] border-gray-700 text-white"
        onKeyDown={handleKeyDown}
      >
        <DrawerHeader 
          totalItems={totalItems}
          groupedItems={groupedItems}
          weekId={weekId}
          onShoppingListUpdate={onShoppingListUpdate}
        />

        <div className="space-y-4">
          {/* Loading State */}
          {isLoading && <LoadingState />}

          {/* Empty State */}
          {!isLoading && totalItems === 0 && <EmptyState />}

          {/* Shopping List Categories */}
          {!isLoading && totalItems > 0 && (
            <>
              <ProgressFooter 
                checkedCount={checkedCount}
                totalItems={totalItems}
              />
              
              <CategoryAccordion
                groupedItems={groupedItems}
                checkedItems={checkedItems}
                setCheckedItems={setCheckedItems}
                onShoppingListUpdate={onShoppingListUpdate}
              />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingListDrawer;

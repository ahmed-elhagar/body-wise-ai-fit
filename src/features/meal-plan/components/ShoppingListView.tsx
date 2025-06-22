import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  Mail, 
  Search,
  CheckCircle2,
  Package,
  Sparkles,
  Loader2,
  Filter,
  SortAsc
} from 'lucide-react';
import { useEnhancedShoppingList } from '../hooks/useEnhancedShoppingList';
import { getCategoryForIngredient } from '@/utils/mealPlanUtils';
import type { WeeklyMealPlan, DailyMeal } from '../types';
import { toast } from 'sonner';

interface ShoppingListViewProps {
  currentWeekPlan: WeeklyMealPlan | undefined;
  dailyMeals: DailyMeal[];
  onSendShoppingList: () => void;
  onShowAIModal: () => void;
  isGenerating: boolean;
}

interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
  id: string;
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  currentWeekPlan,
  dailyMeals,
  onSendShoppingList,
  onShowAIModal,
  isGenerating
}) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'quantity'>('category');

  const weeklyPlanData = currentWeekPlan ? { weeklyPlan: currentWeekPlan, dailyMeals } : null;
  const { enhancedShoppingItems, sendShoppingListEmail } = useEnhancedShoppingList(weeklyPlanData);

  // Enhanced shopping list with proper deduplication and quantity totaling
  const processedShoppingItems = useMemo(() => {
    if (!dailyMeals || dailyMeals.length === 0) {
      return { items: [], groupedItems: {}, totalItems: 0, categories: [] };
    }

    console.log('🛒 Processing shopping list with enhanced deduplication...');
    
    // Use Map for better performance and exact matching
    const itemsMap = new Map<string, ShoppingItem>();
    
    dailyMeals.forEach((meal, mealIndex) => {
      if (meal.ingredients && Array.isArray(meal.ingredients)) {
        meal.ingredients.forEach((ingredient: any) => {
          const ingredientName = (ingredient.name || ingredient || '').toString().trim().toLowerCase();
          const quantity = parseFloat(ingredient.quantity || '1') || 1;
          const unit = (ingredient.unit || 'piece').toString().toLowerCase();
          
          if (!ingredientName) return;
          
          // Create unique key for exact matching (name + unit)
          const key = `${ingredientName}-${unit}`;
          
          if (itemsMap.has(key)) {
            // Add to existing item
            const existing = itemsMap.get(key)!;
            existing.quantity += quantity;
            console.log(`🔄 Consolidated: ${ingredientName} (${existing.quantity} ${unit})`);
          } else {
            // Create new item
            const newItem: ShoppingItem = {
              id: key,
              name: ingredientName,
              quantity: quantity,
              unit: unit,
              category: getCategoryForIngredient(ingredientName),
              checked: checkedItems.has(key)
            };
            itemsMap.set(key, newItem);
            console.log(`➕ Added: ${ingredientName} (${quantity} ${unit}) - ${newItem.category}`);
          }
        });
      }
    });

    const items = Array.from(itemsMap.values());
    
    // Group by category
    const groupedItems = items.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, ShoppingItem[]>);

    // Sort items within each category
    Object.keys(groupedItems).forEach(category => {
      groupedItems[category].sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'quantity':
            return b.quantity - a.quantity;
          default:
            return a.name.localeCompare(b.name);
        }
      });
    });

    const categories = Object.keys(groupedItems).sort();

    console.log('🛒 Enhanced shopping list processed:', {
      totalUniqueItems: items.length,
      categories: categories.length,
      itemsByCategory: Object.entries(groupedItems).map(([cat, items]) => `${cat}: ${items.length}`)
    });
    
    return { 
      items, 
      groupedItems, 
      totalItems: items.length,
      categories
    };
  }, [dailyMeals, sortBy, checkedItems]);

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    const { groupedItems } = processedShoppingItems;
    
    if (!searchTerm && selectedCategory === 'all') {
      return groupedItems;
    }

    const filtered: Record<string, ShoppingItem[]> = {};
    
    Object.entries(groupedItems).forEach(([category, items]) => {
      if (selectedCategory !== 'all' && category !== selectedCategory) {
        return;
      }
      
      const categoryItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (categoryItems.length > 0) {
        filtered[category] = categoryItems;
      }
    });
    
    return filtered;
  }, [processedShoppingItems, searchTerm, selectedCategory]);

  const handleItemCheck = (itemId: string) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(itemId)) {
      newCheckedItems.delete(itemId);
    } else {
      newCheckedItems.add(itemId);
    }
    setCheckedItems(newCheckedItems);
  };

  const handleCheckAll = () => {
    if (checkedItems.size === processedShoppingItems.totalItems) {
      setCheckedItems(new Set());
    } else {
      setCheckedItems(new Set(processedShoppingItems.items.map(item => item.id)));
    }
  };

  const handleSendEmail = async () => {
    if (processedShoppingItems.totalItems === 0) {
      toast.error('No items in shopping list to send');
      return;
    }
    
    await onSendShoppingList();
  };

  const checkedCount = checkedItems.size;
  const totalCount = processedShoppingItems.totalItems;
  const completionPercentage = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  if (!currentWeekPlan) {
    return (
      <Card className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingCart className="h-12 w-12 text-brand-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-brand-neutral-900 mb-2">Smart Shopping List</h3>
          <p className="text-brand-neutral-600 mb-4">
            Generate a meal plan to automatically create your shopping list with all ingredients organized by category.
          </p>
          <Button 
            onClick={onShowAIModal}
            disabled={isGenerating}
            className="bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 hover:from-brand-primary-600 hover:to-brand-secondary-600 text-white border-0"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Meal Plan
          </Button>
        </div>
      </Card>
    );
  }

  if (totalCount === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <Package className="h-12 w-12 text-brand-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-brand-neutral-900 mb-2">No Ingredients Found</h3>
          <p className="text-brand-neutral-600 mb-4">
            Your meal plan doesn't have detailed ingredients yet. This happens when meals are generated without full recipe details.
          </p>
          <Button 
            onClick={onShowAIModal}
            disabled={isGenerating}
            className="bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 hover:from-brand-primary-600 hover:to-brand-secondary-600 text-white border-0"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Regenerate with Details
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-brand-neutral-900 flex items-center">
              <ShoppingCart className="h-6 w-6 mr-3 text-brand-primary-600" />
              Shopping List
            </h2>
            <p className="text-brand-neutral-600 mt-1">
              Week of {currentWeekPlan.week_start_date} • {totalCount} unique items
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-brand-primary-600">
              {completionPercentage}%
            </div>
            <div className="text-sm text-brand-neutral-600">
              {checkedCount} of {totalCount} checked
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-brand-neutral-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleCheckAll}
            variant="outline"
            className="flex-1 min-w-[120px]"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {checkedItems.size === totalCount ? 'Uncheck All' : 'Check All'}
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={totalCount === 0}
            className="flex-1 min-w-[120px] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email List
          </Button>
        </div>
      </Card>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-neutral-400 h-4 w-4" />
              <Input
                placeholder="Search ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-brand-neutral-300 rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              {processedShoppingItems.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-brand-neutral-300 rounded-md text-sm"
            >
              <option value="category">Sort by Category</option>
              <option value="name">Sort by Name</option>
              <option value="quantity">Sort by Quantity</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Shopping Items by Category */}
      <div className="space-y-4">
        {Object.entries(filteredItems).map(([category, items]) => (
          <Card key={category} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-brand-neutral-900 flex items-center">
                <div className="w-3 h-3 bg-brand-primary-500 rounded-full mr-3"></div>
                {category}
              </h3>
              <Badge variant="secondary">
                {items.length} items
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                    checkedItems.has(item.id)
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-brand-neutral-200 hover:border-brand-neutral-300'
                  }`}
                >
                  <Checkbox
                    checked={checkedItems.has(item.id)}
                    onCheckedChange={() => handleItemCheck(item.id)}
                    className="flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium capitalize ${
                      checkedItems.has(item.id) ? 'line-through text-brand-neutral-500' : 'text-brand-neutral-900'
                    }`}>
                      {item.name}
                    </div>
                    <div className="text-sm text-brand-neutral-600">
                      {item.quantity} {item.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {Object.keys(filteredItems).length === 0 && (
        <Card className="p-8 text-center">
          <Search className="h-12 w-12 text-brand-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-brand-neutral-900 mb-2">No Items Found</h3>
          <p className="text-brand-neutral-600">
            Try adjusting your search terms or category filter.
          </p>
        </Card>
      )}
    </div>
  );
}; 
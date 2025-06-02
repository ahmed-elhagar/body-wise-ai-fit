
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import IngredientRow from "./IngredientRow";
import type { ShoppingItem } from "@/types/shoppingList";

interface CategoryAccordionProps {
  groupedItems: Record<string, ShoppingItem[]>;
  checkedItems: Set<string>;
  setCheckedItems: (items: Set<string>) => void;
  onShoppingListUpdate?: () => void;
}

const CategoryAccordion = ({ 
  groupedItems, 
  checkedItems, 
  setCheckedItems,
  onShoppingListUpdate 
}: CategoryAccordionProps) => {
  const { t, isRTL } = useLanguage();

  const handleToggleItem = (itemKey: string) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(itemKey)) {
      newCheckedItems.delete(itemKey);
    } else {
      newCheckedItems.add(itemKey);
    }
    setCheckedItems(newCheckedItems);
    
    if (onShoppingListUpdate) {
      onShoppingListUpdate();
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Proteins': '🥩',
      'Vegetables': '🥬',
      'Fruits': '🍎',
      'Grains': '🌾',
      'Dairy': '🥛',
      'Spices': '🧄',
      'Condiments': '🧂',
      'Other': '🛒'
    };
    return icons[category] || '🛒';
  };

  if (!groupedItems || Object.keys(groupedItems).length === 0) {
    return (
      <div className="text-center py-8 text-fitness-primary-500">
        <p>{t?.('shoppingList.noItems') || 'No items in shopping list'}</p>
      </div>
    );
  }

  return (
    <Accordion type="multiple" defaultValue={Object.keys(groupedItems)} className="space-y-2">
      {Object.entries(groupedItems).map(([category, items]) => {
        const categoryKey = `category-${category}`;
        const checkedCount = items.filter(item => 
          checkedItems.has(`${item.name.toLowerCase()}-${item.unit.toLowerCase()}`)
        ).length;
        
        return (
          <AccordionItem 
            key={categoryKey} 
            value={categoryKey}
            className="border border-fitness-primary-200 rounded-lg overflow-hidden"
          >
            <AccordionTrigger className={`px-4 py-3 bg-fitness-primary-50 hover:bg-fitness-primary-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-lg" role="img" aria-label={category}>
                  {getCategoryIcon(category)}
                </span>
                <span className="font-semibold text-fitness-primary-700">
                  {category}
                </span>
                <Badge className="bg-fitness-accent-500 text-white">
                  {checkedCount}/{items.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2">
              <div className="space-y-2">
                {items.map((item, index) => {
                  const itemKey = `${item.name.toLowerCase()}-${item.unit.toLowerCase()}`;
                  return (
                    <IngredientRow
                      key={`${itemKey}-${index}`}
                      item={item}
                      isChecked={checkedItems.has(itemKey)}
                      onToggle={() => handleToggleItem(itemKey)}
                    />
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default CategoryAccordion;

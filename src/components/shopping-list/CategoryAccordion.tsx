
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import IngredientRow from "./IngredientRow";

interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

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
  const { isRTL } = useLanguage();

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
    onShoppingListUpdate?.();
  };

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

  return (
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
                {categoryItems.map((item, index) => (
                  <IngredientRow
                    key={`${category}-${index}`}
                    item={item}
                    isChecked={checkedItems.has(`${item.name}-${item.category}`)}
                    onToggle={() => {
                      const itemKey = `${item.name}-${item.category}`;
                      const newChecked = new Set(checkedItems);
                      if (newChecked.has(itemKey)) {
                        newChecked.delete(itemKey);
                      } else {
                        newChecked.add(itemKey);
                      }
                      setCheckedItems(newChecked);
                      onShoppingListUpdate?.();
                    }}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default CategoryAccordion;

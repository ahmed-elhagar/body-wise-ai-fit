
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { ShoppingListItem } from "./ShoppingListItem";

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

interface CategoryShoppingCardProps {
  category: string;
  items: ShoppingItem[];
  checkedItems: Set<string>;
  onItemToggle: (itemId: string) => void;
  onCategoryToggle: (category: string) => void;
}

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

const categoryColors: Record<string, string> = {
  'Proteins': 'bg-red-50 border-red-200',
  'Dairy': 'bg-blue-50 border-blue-200',
  'Vegetables': 'bg-green-50 border-green-200',
  'Fruits': 'bg-orange-50 border-orange-200',
  'Grains & Carbs': 'bg-yellow-50 border-yellow-200',
  'Spices & Seasonings': 'bg-purple-50 border-purple-200',
  'Oils & Fats': 'bg-amber-50 border-amber-200',
  'Other': 'bg-gray-50 border-gray-200'
};

export const CategoryShoppingCard = ({ 
  category, 
  items, 
  checkedItems, 
  onItemToggle, 
  onCategoryToggle 
}: CategoryShoppingCardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const checkedCount = items.filter(item => checkedItems.has(item.id)).length;
  const allChecked = checkedCount === items.length;
  const icon = categoryIcons[category] || '📦';
  const colorClass = categoryColors[category] || categoryColors['Other'];

  return (
    <Card className={`${colorClass} shadow-sm hover:shadow-md transition-shadow`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="w-full">
            <CardContent className="p-4 cursor-pointer hover:bg-white/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={() => onCategoryToggle(category)}
                    onClick={(e) => e.stopPropagation()}
                    className="border-gray-400"
                  />
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{category}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-white/70 text-gray-700 text-xs">
                        {checkedCount}/{items.length}
                      </Badge>
                      {allChecked && (
                        <Badge className="bg-green-500 text-white text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="text-gray-500">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-2">
            {items.map((item) => (
              <ShoppingListItem
                key={item.id}
                item={item}
                isChecked={checkedItems.has(item.id)}
                onToggle={() => onItemToggle(item.id)}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

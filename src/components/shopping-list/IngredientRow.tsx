
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ShoppingItem } from "@/types/shoppingList";

interface IngredientRowProps {
  item: ShoppingItem;
  isChecked: boolean;
  onToggle: () => void;
}

const IngredientRow = ({ item, isChecked, onToggle }: IngredientRowProps) => {
  const { isRTL } = useLanguage();

  return (
    <div 
      className="flex items-center space-x-3 p-3 rounded-lg bg-white hover:bg-fitness-primary-50 transition-colors cursor-pointer border border-fitness-primary-100 shadow-sm"
      onClick={onToggle}
    >
      <Checkbox
        checked={isChecked}
        onCheckedChange={onToggle}
        className="border-fitness-primary-300 data-[state=checked]:bg-fitness-primary-500 data-[state=checked]:border-fitness-primary-500"
      />
      <div className="flex-1">
        <span className={`font-medium ${isChecked ? 'line-through text-fitness-primary-400' : 'text-fitness-primary-700'}`}>
          {item.name}
        </span>
        <span className={`text-sm ml-2 ${isChecked ? 'line-through text-fitness-primary-400' : 'text-fitness-primary-500'}`}>
          {item.quantity} {isRTL && item.unit === 'g' ? 'جم' : item.unit}
        </span>
      </div>
    </div>
  );
};

export default IngredientRow;

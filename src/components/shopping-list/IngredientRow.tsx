
import { Checkbox } from "@/components/ui/checkbox";
import { useI18n } from "@/hooks/useI18n";

interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

interface IngredientRowProps {
  item: ShoppingItem;
  isChecked: boolean;
  onToggle: () => void;
}

const IngredientRow = ({ item, isChecked, onToggle }: IngredientRowProps) => {
  const { isRTL } = useI18n();

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

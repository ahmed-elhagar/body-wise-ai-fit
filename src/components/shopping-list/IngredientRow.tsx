
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { isRTL } = useLanguage();

  return (
    <div 
      className="flex items-center space-x-3 p-2 rounded bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer"
      onClick={onToggle}
    >
      <Checkbox
        checked={isChecked}
        onCheckedChange={onToggle}
        className="border-gray-500"
      />
      <div className="flex-1">
        <span className={`font-medium ${isChecked ? 'line-through text-gray-500' : 'text-white'}`}>
          {item.name}
        </span>
        <span className={`text-sm ml-2 ${isChecked ? 'line-through text-gray-600' : 'text-gray-400'}`}>
          {item.quantity} {isRTL && item.unit === 'g' ? 'جم' : item.unit}
        </span>
      </div>
    </div>
  );
};

export default IngredientRow;

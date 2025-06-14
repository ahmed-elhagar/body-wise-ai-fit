
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  mealType: string;
  onMealTypeChange: (mealType: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

const QuantitySelector = ({
  quantity,
  onQuantityChange,
  mealType,
  onMealTypeChange,
  notes,
  onNotesChange
}: QuantitySelectorProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          {t('Quantity (grams)')}
        </Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          min="1"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="mealType" className="text-sm font-medium text-gray-700">
          {t('Meal Type')}
        </Label>
        <select
          id="mealType"
          value={mealType}
          onChange={(e) => onMealTypeChange(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="breakfast">{t('Breakfast')}</option>
          <option value="lunch">{t('Lunch')}</option>
          <option value="dinner">{t('Dinner')}</option>
          <option value="snack">{t('Snack')}</option>
        </select>
      </div>

      <div>
        <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
          {t('Notes')} ({t('Optional')})
        </Label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={t('Add any notes about this meal...')}
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          rows={2}
        />
      </div>
    </div>
  );
};

export default QuantitySelector;

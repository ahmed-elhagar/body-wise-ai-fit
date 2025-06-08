
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    <div className="space-y-4">
      <div>
        <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          {t('Quantity (grams)')}
        </Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          className="mt-1"
          min="1"
        />
      </div>

      <div>
        <Label htmlFor="mealType" className="text-sm font-medium text-gray-700">
          {t('Meal Type')}
        </Label>
        <Select value={mealType} onValueChange={onMealTypeChange}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">{t('Breakfast')}</SelectItem>
            <SelectItem value="lunch">{t('Lunch')}</SelectItem>
            <SelectItem value="dinner">{t('Dinner')}</SelectItem>
            <SelectItem value="snack">{t('Snack')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
          {t('Notes')} ({t('Optional')})
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={t('Add any notes about this food...')}
          className="mt-1"
          rows={3}
        />
      </div>
    </div>
  );
};

export default QuantitySelector;

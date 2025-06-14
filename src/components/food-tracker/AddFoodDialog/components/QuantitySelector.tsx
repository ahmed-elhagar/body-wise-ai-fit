
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  const { t, isRTL } = useLanguage();

  const mealTypes = [
    { value: 'breakfast', label: t('Breakfast') },
    { value: 'lunch', label: t('Lunch') },
    { value: 'dinner', label: t('Dinner') },
    { value: 'snack', label: t('Snack') }
  ];

  return (
    <div className="space-y-4">
      {/* Quantity */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">{t('Quantity')} ({t('grams')})</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => onQuantityChange(parseInt(e.target.value) || 100)}
            min="1"
            max="10000"
          />
        </div>

        {/* Meal Type */}
        <div className="space-y-2">
          <Label htmlFor="mealType">{t('Meal Type')}</Label>
          <Select value={mealType} onValueChange={onMealTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mealTypes.map(meal => (
                <SelectItem key={meal.value} value={meal.value}>
                  {meal.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">{t('Notes')} ({t('optional')})</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={t('Add any notes about this food...')}
          rows={2}
        />
      </div>
    </div>
  );
};

export default QuantitySelector;

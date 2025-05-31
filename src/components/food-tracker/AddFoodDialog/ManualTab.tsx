
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFoodDatabase } from "@/hooks/useFoodDatabase";
import QuantitySelector from "./components/QuantitySelector";

interface ManualTabProps {
  onFoodAdded: () => void;
  onClose: () => void;
}

const ManualTab = ({ onFoodAdded, onClose }: ManualTabProps) => {
  const { t } = useLanguage();
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [quantity, setQuantity] = useState(100);
  const [mealType, setMealType] = useState("snack");
  const [notes, setNotes] = useState("");

  const { logConsumption, isLoggingConsumption } = useFoodDatabase();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foodName.trim()) {
      return;
    }

    // Calculate nutrition based on quantity
    const multiplier = quantity / 100;
    
    const logData = {
      foodItemId: 'manual-entry', // Placeholder for manual entries
      quantity,
      mealType,
      notes: notes || `Manual entry: ${foodName}`,
      calories: calories * multiplier,
      protein: protein * multiplier,
      carbs: carbs * multiplier,
      fat: fat * multiplier,
      source: 'manual' as const,
    };

    logConsumption(logData);
    onFoodAdded();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="foodName">{t('Food Name')}</Label>
          <Input
            id="foodName"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder={t('Enter food name...')}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="calories">{t('Calories (per 100g)')}</Label>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              min="0"
              step="1"
            />
          </div>

          <div>
            <Label htmlFor="protein">{t('Protein (g per 100g)')}</Label>
            <Input
              id="protein"
              type="number"
              value={protein}
              onChange={(e) => setProtein(Number(e.target.value))}
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <Label htmlFor="carbs">{t('Carbs (g per 100g)')}</Label>
            <Input
              id="carbs"
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(Number(e.target.value))}
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <Label htmlFor="fat">{t('Fat (g per 100g)')}</Label>
            <Input
              id="fat"
              type="number"
              value={fat}
              onChange={(e) => setFat(Number(e.target.value))}
              min="0"
              step="0.1"
            />
          </div>
        </div>
      </div>

      <QuantitySelector
        quantity={quantity}
        onQuantityChange={setQuantity}
        mealType={mealType}
        onMealTypeChange={setMealType}
        notes={notes}
        onNotesChange={setNotes}
      />

      <Button
        type="submit"
        disabled={isLoggingConsumption || !foodName.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        {isLoggingConsumption ? t('Adding...') : t('Add to Log')}
      </Button>
    </form>
  );
};

export default ManualTab;

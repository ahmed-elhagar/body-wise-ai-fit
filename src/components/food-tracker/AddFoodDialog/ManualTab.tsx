
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFoodTracking } from "@/hooks/useFoodTracking";
import { toast } from "sonner";

interface ManualTabProps {
  onFoodAdded: () => void;
  onClose: () => void;
  preSelectedFood?: any;
}

const ManualTab = ({ onFoodAdded, onClose, preSelectedFood }: ManualTabProps) => {
  const { t } = useLanguage();
  const { addFoodConsumption, isAdding } = useFoodTracking();

  // Form state
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [quantity, setQuantity] = useState("100");
  const [mealType, setMealType] = useState("snack");
  const [notes, setNotes] = useState("");

  // Pre-fill form if we have preSelectedFood from AI analysis
  useEffect(() => {
    if (preSelectedFood) {
      setFoodName(preSelectedFood.name || "");
      setCalories(String(preSelectedFood.calories || ""));
      setProtein(String(preSelectedFood.protein || ""));
      setCarbs(String(preSelectedFood.carbs || ""));
      setFat(String(preSelectedFood.fat || ""));
      setQuantity("100"); // Default serving size
      setNotes(preSelectedFood.quantity ? `AI detected: ${preSelectedFood.quantity}` : "Added from AI analysis");
    }
  }, [preSelectedFood]);

  const handleSubmit = () => {
    if (!foodName.trim()) {
      toast.error(t('Please enter a food name'));
      return;
    }

    const quantityNum = parseFloat(quantity) || 100;
    const caloriesNum = parseFloat(calories) || 0;
    const proteinNum = parseFloat(protein) || 0;
    const carbsNum = parseFloat(carbs) || 0;
    const fatNum = parseFloat(fat) || 0;

    // Calculate nutrition per actual quantity
    const multiplier = quantityNum / 100;

    const foodConsumption = {
      food_item_id: crypto.randomUUID(),
      quantity_g: quantityNum,
      calories_consumed: caloriesNum * multiplier,
      protein_consumed: proteinNum * multiplier,
      carbs_consumed: carbsNum * multiplier,
      fat_consumed: fatNum * multiplier,
      meal_type: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      consumed_at: new Date().toISOString(),
      notes: notes || undefined,
      source: preSelectedFood ? 'ai_analysis' : 'manual',
      food_item: {
        name: foodName,
        calories_per_100g: caloriesNum,
        protein_per_100g: proteinNum,
        carbs_per_100g: carbsNum,
        fat_per_100g: fatNum,
      }
    };

    addFoodConsumption(foodConsumption);
    onFoodAdded();
    onClose();
  };

  return (
    <div className="space-y-6">
      {preSelectedFood && (
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-medium text-purple-800 mb-2">{t('AI Analyzed Food')}</h3>
          <p className="text-sm text-purple-600">
            {t('This food was analyzed from your photo. You can adjust the values below if needed.')}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {/* Food Name */}
        <div>
          <Label htmlFor="foodName">{t('Food Name')} *</Label>
          <Input
            id="foodName"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder={t('Enter food name')}
            className="mt-1"
          />
        </div>

        {/* Nutrition Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="calories">{t('Calories')} (per 100g)</Label>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="0"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="protein">{t('Protein')} (g per 100g)</Label>
            <Input
              id="protein"
              type="number"
              step="0.1"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="0"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="carbs">{t('Carbs')} (g per 100g)</Label>
            <Input
              id="carbs"
              type="number"
              step="0.1"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="0"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="fat">{t('Fat')} (g per 100g)</Label>
            <Input
              id="fat"
              type="number"
              step="0.1"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              placeholder="0"
              className="mt-1"
            />
          </div>
        </div>

        {/* Quantity and Meal Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity">{t('Quantity')} (g)</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="100"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="mealType">{t('Meal Type')}</Label>
            <Select value={mealType} onValueChange={setMealType}>
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
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">{t('Notes')} ({t('optional')})</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('Add any notes about this food...')}
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Nutrition Preview */}
        {(calories || protein || carbs || fat) && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">{t('Nutrition Summary')}</h4>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round((parseFloat(calories) || 0) * (parseFloat(quantity) || 100) / 100)}
                </div>
                <div className="text-green-600">cal</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round((parseFloat(protein) || 0) * (parseFloat(quantity) || 100) / 100)}g
                </div>
                <div className="text-green-600">protein</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round((parseFloat(carbs) || 0) * (parseFloat(quantity) || 100) / 100)}g
                </div>
                <div className="text-green-600">carbs</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round((parseFloat(fat) || 0) * (parseFloat(quantity) || 100) / 100)}g
                </div>
                <div className="text-green-600">fat</div>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isAdding || !foodName.trim()}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isAdding ? t('Adding...') : t('Add to Log')}
        </Button>
      </div>
    </div>
  );
};

export default ManualTab;


import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFoodDatabase } from "@/hooks/useFoodDatabase";
import QuantitySelector from "./components/QuantitySelector";
import { toast } from "sonner";

interface ManualTabProps {
  onFoodAdded: () => void;
  onClose: () => void;
}

const ManualTab = ({ onFoodAdded, onClose }: ManualTabProps) => {
  const { t, isRTL } = useLanguage();
  const [foodName, setFoodName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("general");
  const [caloriesPer100g, setCaloriesPer100g] = useState("");
  const [proteinPer100g, setProteinPer100g] = useState("");
  const [carbsPer100g, setCarbsPer100g] = useState("");
  const [fatPer100g, setFatPer100g] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [mealType, setMealType] = useState("snack");
  const [notes, setNotes] = useState("");

  const { logConsumption, isLoggingConsumption } = useFoodDatabase();

  const handleAddFood = async () => {
    if (!foodName || !caloriesPer100g) {
      toast.error(t('Please fill in food name and calories'));
      return;
    }

    const multiplier = quantity / 100;
    const calories = parseFloat(caloriesPer100g) * multiplier;
    const protein = parseFloat(proteinPer100g || "0") * multiplier;
    const carbs = parseFloat(carbsPer100g || "0") * multiplier;
    const fat = parseFloat(fatPer100g || "0") * multiplier;

    try {
      const manualFoodData = {
        name: foodName,
        brand,
        category,
        calories: parseFloat(caloriesPer100g),
        protein: parseFloat(proteinPer100g || "0"),
        carbs: parseFloat(carbsPer100g || "0"),
        fat: parseFloat(fatPer100g || "0"),
        servings: 1
      };

      logConsumption({
        foodItemId: `manual-${Date.now()}`,
        quantity,
        mealType,
        notes,
        calories,
        protein,
        carbs,
        fat,
        source: 'manual',
        mealData: manualFoodData
      });
      
      onFoodAdded();
      onClose();
    } catch (error) {
      console.error('Error logging manual food:', error);
      toast.error('Failed to log food');
    }
  };

  const foodCategories = [
    'general', 'protein', 'vegetables', 'fruits', 'grains', 
    'dairy', 'nuts', 'beverages', 'snacks'
  ];

  return (
    <div className="space-y-6">
      <h3 className="font-medium text-gray-900">{t('Add Food Manually')}</h3>
      
      <div className="space-y-4">
        {/* Food Name */}
        <div className="space-y-2">
          <Label htmlFor="foodName">{t('Food Name')} *</Label>
          <Input
            id="foodName"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder={t('Enter food name...')}
          />
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <Label htmlFor="brand">{t('Brand')} ({t('optional')})</Label>
          <Input
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder={t('Enter brand name...')}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">{t('Category')}</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {foodCategories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {t(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nutrition per 100g */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="calories">{t('Calories per 100g')} *</Label>
            <Input
              id="calories"
              type="number"
              value={caloriesPer100g}
              onChange={(e) => setCaloriesPer100g(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="protein">{t('Protein per 100g')} (g)</Label>
            <Input
              id="protein"
              type="number"
              value={proteinPer100g}
              onChange={(e) => setProteinPer100g(e.target.value)}
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="carbs">{t('Carbs per 100g')} (g)</Label>
            <Input
              id="carbs"
              type="number"
              value={carbsPer100g}
              onChange={(e) => setCarbsPer100g(e.target.value)}
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fat">{t('Fat per 100g')} (g)</Label>
            <Input
              id="fat"
              type="number"
              value={fatPer100g}
              onChange={(e) => setFatPer100g(e.target.value)}
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>
        </div>

        {/* Preview */}
        {foodName && caloriesPer100g && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">{t('Nutrition Preview')}</h4>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round(parseFloat(caloriesPer100g) * (quantity / 100))}
                </div>
                <div className="text-green-600">cal</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round(parseFloat(proteinPer100g || "0") * (quantity / 100))}g
                </div>
                <div className="text-green-600">protein</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round(parseFloat(carbsPer100g || "0") * (quantity / 100))}g
                </div>
                <div className="text-green-600">carbs</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800">
                  {Math.round(parseFloat(fatPer100g || "0") * (quantity / 100))}g
                </div>
                <div className="text-green-600">fat</div>
              </div>
            </div>
          </div>
        )}

        <QuantitySelector
          quantity={quantity}
          onQuantityChange={setQuantity}
          mealType={mealType}
          onMealTypeChange={setMealType}
          notes={notes}
          onNotesChange={setNotes}
        />

        <Button
          onClick={handleAddFood}
          disabled={!foodName || !caloriesPer100g || isLoggingConsumption}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isLoggingConsumption ? t('Adding...') : t('Add to Log')}
        </Button>
      </div>
    </div>
  );
};

export default ManualTab;

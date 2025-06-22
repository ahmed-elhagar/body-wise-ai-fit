
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFoodTracking } from '../hooks';
import { toast } from 'sonner';

interface SearchTabProps {
  onFoodAdded: () => void;
  onClose: () => void;
}

// NOTE: This is a placeholder implementation for SearchTab.
const SearchTab = ({ onFoodAdded, onClose }: SearchTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { addFoodConsumption, isAdding } = useFoodTracking();

  const handleAdd = async () => {
    // This is a dummy implementation.
    // In a real scenario, you would search a database and select a food item.
    const foodItem = {
      food_item_id: crypto.randomUUID(),
      quantity_g: 100,
      calories_consumed: 150,
      protein_consumed: 10,
      carbs_consumed: 20,
      fat_consumed: 5,
      meal_type: 'snack' as const,
      consumed_at: new Date().toISOString(),
      source: 'manual' as const,
      food_item: {
        name: searchTerm || "Dummy Food",
        calories_per_100g: 150,
        protein_per_100g: 10,
        carbs_per_100g: 20,
        fat_per_100g: 5,
      },
    };
    await addFoodConsumption(foodItem);
    toast.success(`"${foodItem.food_item.name}" added.`);
    onFoodAdded();
    onClose();
  };

  return (
    <div className="p-2 space-y-4">
      <Input
        placeholder="Search for food..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <p className="text-sm text-center text-gray-500">Search functionality is a placeholder.</p>
      <Button onClick={handleAdd} disabled={!searchTerm || isAdding} className="w-full">
        {isAdding ? 'Adding...' : `Add "${searchTerm}"`}
      </Button>
    </div>
  );
};

export default SearchTab;

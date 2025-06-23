
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFoodConsumption } from '../hooks';
import { toast } from 'sonner';

interface SearchTabProps {
  onFoodAdded: () => void;
  onClose: () => void;
}

// NOTE: This is a placeholder implementation for SearchTab.
const SearchTab = ({ onFoodAdded, onClose }: SearchTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { addConsumption, isAddingConsumption } = useFoodConsumption();

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
    };
    await addConsumption(foodItem);
    toast.success(`"${searchTerm}" added.`);
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
      <Button onClick={handleAdd} disabled={!searchTerm || isAddingConsumption} className="w-full">
        {isAddingConsumption ? 'Adding...' : `Add "${searchTerm}"`}
      </Button>
    </div>
  );
};

export default SearchTab;

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FoodTracker as FoodTrackerComponent } from "@/features/food-tracker";
import AddFoodDialog from "@/features/food-tracker/components/AddFoodDialog";
import { toast } from "sonner";
import { useQueryClient } from '@tanstack/react-query';
import { useFoodConsumption } from "@/features/food-tracker/hooks";

const FoodTracker = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [preSelectedFood, setPreSelectedFood] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { forceRefresh } = useFoodConsumption();

  // Handle analyzed food from Calorie Checker or AI Scanner
  useEffect(() => {
    console.log('📍 FoodTracker location state:', location.state);
    
    if (location.state?.analyzedFood) {
      console.log('🍕 Received analyzed food:', location.state.analyzedFood);
      setPreSelectedFood(location.state.analyzedFood);
      
      if (location.state?.openAddDialog) {
        setIsAddFoodOpen(true);
      }
      
      // Clear the state to prevent reopening on future navigations
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleFoodAdded = async () => {
    console.log('🔄 Food added, refreshing data...');
    setIsAddFoodOpen(false);
    setPreSelectedFood(null);
    
    try {
      // Clear all food consumption queries with specific user-based invalidation
      console.log('🧹 Clearing query cache...');
      await queryClient.invalidateQueries({ 
        queryKey: ['food-consumption'],
        exact: false 
      });
      
      // Force refresh of food consumption data
      console.log('🔄 Force refreshing consumption data...');
      await forceRefresh();
      
      // Force component re-render with new key
      setRefreshKey(prev => {
        console.log('🔑 Updating refresh key from', prev, 'to', prev + 1);
        return prev + 1;
      });
      
      // Show success message
      toast.success('Food added successfully!');
      
      console.log('✅ Data refresh completed');
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
      toast.error('Food added but failed to refresh data');
    }
  };

  const handleOpenAddDialog = () => {
    setPreSelectedFood(null);
    setIsAddFoodOpen(true);
  };

  return (
    <>
      <FoodTrackerComponent 
        key={refreshKey}
        refreshKey={refreshKey}
        onAddFood={handleOpenAddDialog}
      />
      
      {/* Add Food Dialog */}
      <AddFoodDialog
        isOpen={isAddFoodOpen}
        onClose={() => {
          setIsAddFoodOpen(false);
          setPreSelectedFood(null);
        }}
        onFoodAdded={handleFoodAdded}
        preSelectedFood={preSelectedFood}
      />
    </>
  );
};

export default FoodTracker;

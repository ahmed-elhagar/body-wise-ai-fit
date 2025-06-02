
import { useMealPlanCore } from "./useMealPlanCore";
import { useMealPlanDialogs } from "@/features/meal-plan/hooks/useMealPlanDialogs";
import { useMealPlanAIActions } from "./useMealPlanAIActions";

export const useMealPlanState = () => {
  // Core state management
  const coreState = useMealPlanCore();
  
  // Dialog state management
  const dialogsState = useMealPlanDialogs();
  
  // AI actions
  const aiActions = useMealPlanAIActions(coreState, dialogsState);

  // Combine all state with explicit property inclusion
  const combinedState = {
    // Core state - all properties from useMealPlanCore
    ...coreState,
    
    // Dialog state - all properties from useMealPlanDialogs
    ...dialogsState,
    
    // AI actions - all methods from useMealPlanAIActions
    ...aiActions
  };

  console.log('🔍 useMealPlanState combined properties:', Object.keys(combinedState));

  return combinedState;
};

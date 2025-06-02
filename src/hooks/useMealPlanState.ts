
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

  return {
    // Core state
    ...coreState,
    
    // Dialog state - ensure all properties are included
    ...dialogsState,
    
    // AI actions
    ...aiActions
  };
};

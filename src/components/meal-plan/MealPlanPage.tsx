
import { useState } from "react";
import { useMealPlanPage } from "@/hooks/useMealPlanPage";
import { useMealPlanTranslation } from "@/utils/translationHelpers";
import MealPlanPageLayout from "./MealPlanPageLayout";
import MealPlanContent from "./MealPlanContent";
import MealPlanDialogsContainer from "./MealPlanDialogsContainer";

const MealPlanPage = () => {
  const { mealPlanT } = useMealPlanTranslation();
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);

  const {
    currentWeekPlan,
    selectedDayNumber,
    setShowAIDialog,
    refetch
  } = useMealPlanPage();

  const handleShowAIDialog = () => {
    setShowAIDialog(true);
  };

  const handleShowAddSnackDialog = () => {
    setShowAddSnackDialog(true);
  };

  const handleShowShoppingListDialog = () => {
    setShowShoppingListDialog(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <MealPlanPageLayout>
      <MealPlanContent
        onShowAIDialog={handleShowAIDialog}
        onShowAddSnackDialog={handleShowAddSnackDialog}
        onShowShoppingListDialog={handleShowShoppingListDialog}
      />
      
      <MealPlanDialogsContainer
        showAddSnackDialog={showAddSnackDialog}
        onCloseAddSnackDialog={() => setShowAddSnackDialog(false)}
        showShoppingListDialog={showShoppingListDialog}
        onCloseShoppingListDialog={() => setShowShoppingListDialog(false)}
        currentWeekPlan={currentWeekPlan}
        selectedDayNumber={selectedDayNumber}
        weeklyPlanId={currentWeekPlan?.weeklyPlan?.id}
        onRefresh={handleRefresh}
      />
    </MealPlanPageLayout>
  );
};

export default MealPlanPage;

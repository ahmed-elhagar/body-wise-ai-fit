
import { useState } from "react";
import MealPlanPageLayout from "./MealPlanPageLayout";
import MealPlanContent from "./MealPlanContent";
import MealPlanDialogsContainer from "./MealPlanDialogsContainer";

const MealPlanPage = () => {
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);

  const handleShowAIDialog = () => {
    // This will be handled by the content component
  };

  const handleShowAddSnackDialog = () => {
    setShowAddSnackDialog(true);
  };

  const handleShowShoppingListDialog = () => {
    setShowShoppingListDialog(true);
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
      />
    </MealPlanPageLayout>
  );
};

export default MealPlanPage;


import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface MealPlanLoadingBackdropProps {
  isLoading: boolean;
  title?: string;
  description?: string;
}

const MealPlanLoadingBackdrop = ({ 
  isLoading, 
  title = "Generating Your Meal Plan",
  description = "Please wait while we create your personalized meals..."
}: MealPlanLoadingBackdropProps) => {
  if (!isLoading) return null;

  return (
    <Dialog open={isLoading}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center py-6">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealPlanLoadingBackdrop;

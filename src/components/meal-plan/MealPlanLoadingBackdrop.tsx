
import LoadingIndicator from "@/components/ui/loading-indicator";

interface MealPlanLoadingBackdropProps {
  isLoading: boolean;
  message?: string;
}

const MealPlanLoadingBackdrop = ({ isLoading, message = "Loading..." }: MealPlanLoadingBackdropProps) => {
  if (!isLoading) return null;

  return (
    <LoadingIndicator
      status="loading"
      message={message}
      description="Please wait while we process your request..."
      variant="overlay"
      size="lg"
    />
  );
};

export default MealPlanLoadingBackdrop;

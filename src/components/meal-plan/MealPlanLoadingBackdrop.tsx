
import PageLoadingOverlay from "@/components/ui/page-loading-overlay";

interface MealPlanLoadingBackdropProps {
  isLoading: boolean;
  message?: string;
  type?: 'meal-plan' | 'recipe' | 'analysis' | 'general';
}

const MealPlanLoadingBackdrop = ({ 
  isLoading, 
  message,
  type = 'meal-plan'
}: MealPlanLoadingBackdropProps) => {
  return (
    <PageLoadingOverlay
      isLoading={isLoading}
      type={type}
      message={message}
      description="Please wait while we process your request..."
    />
  );
};

export default MealPlanLoadingBackdrop;


import { ReactNode } from "react";
import { ErrorBoundary } from "../ErrorBoundary";

interface MealPlanPageLayoutProps {
  children: ReactNode;
}

const MealPlanPageLayout = ({ children }: MealPlanPageLayoutProps) => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-fitness-primary-25 via-white to-fitness-accent-25">
        <div className="container mx-auto px-4 py-6 space-y-4">
          {children}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MealPlanPageLayout;

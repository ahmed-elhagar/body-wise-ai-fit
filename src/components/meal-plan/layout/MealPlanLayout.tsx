
import { ReactNode } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface MealPlanLayoutProps {
  children: ReactNode;
}

const MealPlanLayout = ({ children }: MealPlanLayoutProps) => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-fitness-primary-25 via-white to-fitness-accent-25">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {children}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MealPlanLayout;

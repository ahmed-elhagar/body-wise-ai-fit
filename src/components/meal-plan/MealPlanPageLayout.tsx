
import { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealPlanPageLayoutProps {
  children: ReactNode;
}

const MealPlanPageLayout = ({ children }: MealPlanPageLayoutProps) => {
  const { isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-fitness-primary-50 via-white to-fitness-accent-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MealPlanPageLayout;

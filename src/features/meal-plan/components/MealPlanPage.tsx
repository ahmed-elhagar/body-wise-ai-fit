
import React from 'react';
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealPlanPageProps {
  // Props will be properly typed once we consolidate the hooks
  [key: string]: any;
}

export const MealPlanPage: React.FC<MealPlanPageProps> = (props) => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="container mx-auto px-4 py-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">{t('mealPlan.title')}</h1>
          <p className="text-gray-600">
            Meal plan functionality will be restored after component consolidation.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default MealPlanPage;

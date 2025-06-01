
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Utensils, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmptyMealPlanProps {
  onGenerate: () => void;
}

const EmptyMealPlan = ({ onGenerate }: EmptyMealPlanProps) => {
  const { t } = useLanguage();

  const handleRefresh = () => {
    console.log('🔄 EmptyMealPlan: Force refresh triggered');
    // Force a hard refresh to clear any cached data
    window.location.reload();
  };

  const handleGenerate = () => {
    console.log('🚀 EmptyMealPlan: Generate plan triggered');
    onGenerate();
  };

  return (
    <Card className="p-12 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
      <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('mealPlan.noActivePlan')}</h3>
      <p className="text-gray-600 mb-6">{t('mealPlan.personalizedProfile')}</p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          onClick={handleGenerate}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {t('mealPlan.generateAIMealPlan')}
        </Button>
        
        <Button 
          onClick={handleRefresh}
          variant="outline"
          className="bg-white/50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Page
        </Button>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 space-y-1">
        <p>If you just generated a plan, try refreshing the page or check the current week.</p>
        <p className="text-xs">Debug: Check console for detailed meal plan loading information.</p>
      </div>
    </Card>
  );
};

export default EmptyMealPlan;

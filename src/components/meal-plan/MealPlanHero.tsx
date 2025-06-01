import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChefHat, 
  Calendar, 
  Target, 
  Clock, 
  Sparkles, 
  RefreshCw,
  ShoppingCart,
  BarChart3,
  Download
} from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";

interface MealPlanHeroProps {
  currentWeekPlan: any;
  onGenerateNewPlan: () => void;
  onRegeneratePlan: () => void;
  onShowShoppingList: () => void;
  onShowProgress: () => void;
  onDownloadPlan: () => void;
  isGenerating: boolean;
  dynamicTargetCalories: number;
  totalCalories: number;
  progressPercentage: number;
}

const MealPlanHero = ({
  currentWeekPlan,
  onGenerateNewPlan,
  onRegeneratePlan,
  onShowShoppingList,
  onShowProgress,
  onDownloadPlan,
  isGenerating,
  dynamicTargetCalories,
  totalCalories,
  progressPercentage
}: MealPlanHeroProps) => {
  const { t, isRTL } = useI18n();

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <ChefHat className="w-6 h-6 text-blue-600" />
          {t('mealPlan.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {t('mealPlan.weeklyOverview')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('mealPlan.week')} {currentWeekPlan?.week_number || 1}
            </p>
          </div>
          <Badge variant="secondary">
            <Calendar className="w-4 h-4 mr-2" />
            {currentWeekPlan?.week_start_date || 'Loading...'}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {t('mealPlan.calorieProgress')}
            </span>
            <span className="text-sm font-bold text-blue-600">
              {totalCalories} / {dynamicTargetCalories} {t('mealPlan.cal')}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{t('mealPlan.start')}</span>
            <span>{t('mealPlan.target')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="bg-white/80 hover:bg-gray-50"
            onClick={onGenerateNewPlan}
            disabled={isGenerating}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {t('mealPlan.generateNew')}
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/80 hover:bg-gray-50"
            onClick={onRegeneratePlan}
            disabled={isGenerating}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('mealPlan.regenerate')}
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/80 hover:bg-gray-50"
            onClick={onShowShoppingList}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {t('mealPlan.shoppingList')}
          </Button>
        </div>

        <div className="flex justify-between">
          <Button 
            variant="ghost" 
            className="text-blue-600 hover:bg-blue-50"
            onClick={onShowProgress}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {t('mealPlan.viewProgress')}
          </Button>
          <Button 
            variant="ghost" 
            className="text-green-600 hover:bg-green-50"
            onClick={onDownloadPlan}
          >
            <Download className="w-4 h-4 mr-2" />
            {t('mealPlan.downloadPlan')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealPlanHero;

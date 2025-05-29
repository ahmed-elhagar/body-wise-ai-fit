
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, Flame, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WeeklyPlanHeaderProps {
  dietType: string;
  weeklyCalories: number;
  weeklyProtein: number;
}

const WeeklyPlanHeader = ({ dietType, weeklyCalories, weeklyProtein }: WeeklyPlanHeaderProps) => {
  const { t, isRTL } = useLanguage();

  const getDietTypeColor = (dietType: string) => {
    if (dietType.includes('Vegetarian') || dietType.includes('نباتي')) return 'bg-green-100 text-green-800 border-green-200';
    if (dietType.includes('Keto') || dietType.includes('كيتو')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (dietType.includes('High Protein') || dietType.includes('عالي البروتين')) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-fitness-primary/10 via-white to-pink-50 border-0 shadow-xl">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-12 h-12 bg-fitness-gradient rounded-full flex items-center justify-center">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{t('weeklyMealPlan')}</h3>
            <p className="text-sm text-gray-600">{t('personalizedPlan')}</p>
          </div>
        </div>
        <div className={`flex flex-col items-end gap-2 ${isRTL ? 'items-start' : 'items-end'}`}>
          <Badge className={`${getDietTypeColor(dietType)} font-semibold px-4 py-2 text-sm`}>
            {dietType}
          </Badge>
          {weeklyCalories > 0 && (
            <div className="text-sm text-gray-600">
              {Math.round(weeklyCalories / 7)} {t('calPerDay')}
            </div>
          )}
        </div>
      </div>
      
      {/* Weekly Stats */}
      {(weeklyCalories > 0 || weeklyProtein > 0) && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Flame className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">{t('weeklyCalories')}</span>
            </div>
            <span className="text-2xl font-bold text-red-800">{weeklyCalories.toLocaleString()}</span>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">{t('weeklyProtein')}</span>
            </div>
            <span className="text-2xl font-bold text-green-800">{weeklyProtein}g</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default WeeklyPlanHeader;

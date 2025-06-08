
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, Dumbbell, TrendingUp } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface DashboardWelcomeHeaderProps {
  userName: string;
  onViewMealPlan: () => void;
  onViewExercise: () => void;
}

const DashboardWelcomeHeader = ({
  userName,
  onViewMealPlan,
  onViewExercise
}: DashboardWelcomeHeaderProps) => {
  const { t, isRTL } = useI18n();

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <CardContent className="p-6">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h1 className="text-2xl font-bold mb-2">
              {t('dashboard:welcome') || 'Welcome back'}, {userName}!
            </h1>
            <p className="text-blue-100">
              {t('dashboard:readyToStart') || "Let's continue your fitness journey"}
            </p>
          </div>
          
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button 
              variant="secondary" 
              onClick={onViewMealPlan}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Utensils className="w-4 h-4 mr-2" />
              {t('navigation:mealPlan') || 'Meal Plan'}
            </Button>
            <Button 
              variant="secondary" 
              onClick={onViewExercise}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Dumbbell className="w-4 h-4 mr-2" />
              {t('navigation:exercise') || 'Exercise'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardWelcomeHeader;

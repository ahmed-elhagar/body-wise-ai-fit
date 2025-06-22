
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Target, 
  Utensils, 
  Dumbbell, 
  Calendar,
  TrendingUp,
  Scale,
  Camera,
  Zap
} from 'lucide-react';

export const QuickActions = () => {
  const { t } = useTranslation(['dashboard']);
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: Scale,
      title: t('quickActions.logWeight'),
      description: t('quickActions.trackProgress'),
      action: () => navigate('/weight-tracking'),
      color: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      icon: Camera,
      title: t('quickActions.logFood'),
      description: t('quickActions.checkCalories'),
      action: () => navigate('/food-tracker'),
      color: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      icon: Utensils,
      title: t('quickActions.mealPlan'),
      description: t('quickActions.viewWeeklyMeals'),
      action: () => navigate('/meal-plan'),
      color: 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200',
      iconColor: 'text-orange-600'
    },
    {
      icon: Dumbbell,
      title: t('quickActions.workout'),
      description: t('quickActions.startExercising'),
      action: () => navigate('/exercise'),
      color: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      icon: Target,
      title: t('quickActions.updateGoals'),
      description: t('quickActions.modifyTargets'),
      action: () => navigate('/goals'),
      color: 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200',
      iconColor: 'text-red-600'
    },
    {
      icon: Calendar,
      title: t('quickActions.schedule'),
      description: t('quickActions.planWeek'),
      action: () => navigate('/progress'),
      color: 'bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200',
      iconColor: 'text-teal-600'
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-gray-800">
          <Zap className="w-6 h-6" />
          {t('quickActions.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={action.action}
              className={`h-auto p-4 ${action.color} hover:shadow-md transition-all duration-200 flex flex-col items-start text-left group`}
            >
              <div className="flex items-center gap-3 mb-2 w-full">
                <action.icon className={`w-5 h-5 ${action.iconColor} group-hover:scale-110 transition-transform`} />
                <span className="font-medium text-gray-800">{action.title}</span>
              </div>
              <p className="text-sm text-gray-600 text-left">{action.description}</p>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

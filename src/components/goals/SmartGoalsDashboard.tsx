
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, TrendingUp, Calendar, Filter } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import EnhancedGoalCard from './EnhancedGoalCard';
import SmartGoalCreationWizard from './SmartGoalCreationWizard';

export const SmartGoalsDashboard = () => {
  const { t, isRTL } = useI18n();
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [goals, setGoals] = useState([
    {
      id: '1',
      title: 'Lose 10kg',
      description: 'Reach my target weight for better health',
      target: 10,
      current: 3,
      unit: 'kg',
      deadline: '2024-06-01',
      category: 'weight' as const,
      priority: 'high' as const
    },
    {
      id: '2',
      title: 'Exercise 5 times per week',
      description: 'Build a consistent workout routine',
      target: 5,
      current: 3,
      unit: 'days/week',
      deadline: '2024-04-01',
      category: 'exercise' as const,
      priority: 'medium' as const
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: t('goals:allCategories') || 'All Categories', count: goals.length },
    { value: 'weight', label: t('goals:categories.weight') || 'Weight', count: goals.filter(g => g.category === 'weight').length },
    { value: 'exercise', label: t('goals:categories.exercise') || 'Exercise', count: goals.filter(g => g.category === 'exercise').length },
    { value: 'nutrition', label: t('goals:categories.nutrition') || 'Nutrition', count: goals.filter(g => g.category === 'nutrition').length },
    { value: 'habit', label: t('goals:categories.habit') || 'Habits', count: goals.filter(g => g.category === 'habit').length }
  ];

  const filteredGoals = selectedCategory === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === selectedCategory);

  const completedGoals = goals.filter(goal => (goal.current / goal.target) >= 1).length;
  const activeGoals = goals.length - completedGoals;
  const overallProgress = goals.length > 0 
    ? goals.reduce((sum, goal) => sum + Math.min((goal.current / goal.target) * 100, 100), 0) / goals.length 
    : 0;

  const handleCreateGoal = (newGoal: any) => {
    setGoals([...goals, newGoal]);
    setShowCreateWizard(false);
  };

  const handleEditGoal = (goal: any) => {
    // Implementation for editing goals
    console.log('Edit goal:', goal);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  if (showCreateWizard) {
    return (
      <SmartGoalCreationWizard
        onCreateGoal={handleCreateGoal}
        onCancel={() => setShowCreateWizard(false)}
      />
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('goals:smartGoals') || 'SMART Goals'}
          </h1>
          <p className="text-gray-600">
            {t('goals:trackProgress') || 'Track your progress and achieve your fitness objectives'}
          </p>
        </div>
        <Button onClick={() => setShowCreateWizard(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          {t('goals:createGoal') || 'Create Goal'}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Target className="w-8 h-8 text-blue-600" />
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-2xl font-bold text-blue-600">{activeGoals}</p>
                <p className="text-sm text-blue-700">{t('goals:activeGoals') || 'Active Goals'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-2xl font-bold text-green-600">{completedGoals}</p>
                <p className="text-sm text-green-700">{t('goals:completed') || 'Completed'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="w-8 h-8 text-purple-600" />
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-2xl font-bold text-purple-600">{Math.round(overallProgress)}%</p>
                <p className="text-sm text-purple-700">{t('goals:avgProgress') || 'Avg Progress'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Filter className="w-5 h-5" />
            {t('goals:filterByCategory') || 'Filter by Category'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {category.label}
                <Badge variant="secondary" className="ml-1">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('goals:noGoalsYet') || 'No Goals Yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('goals:createFirstGoal') || 'Create your first SMART goal to start tracking your progress'}
            </p>
            <Button onClick={() => setShowCreateWizard(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('goals:createFirstGoal') || 'Create Your First Goal'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => (
            <EnhancedGoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartGoalsDashboard;

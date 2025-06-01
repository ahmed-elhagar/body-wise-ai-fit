import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Target } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";
import { useNavigate } from 'react-router-dom';
import { useGoals } from '@/hooks/useGoals';
import { Goal } from '@/types/goal';
import { GoalCard } from './GoalCard';

const SmartGoalsDashboard = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { goals, isLoading, error } = useGoals();
  const [showCompleted, setShowCompleted] = useState(false);

  const handleCreateGoal = () => {
    navigate('/goals/create');
  };

  const toggleShowCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  const filteredGoals = React.useMemo(() => {
    if (showCompleted) {
      return goals;
    }
    return goals?.filter((goal: Goal) => !goal.completed);
  }, [goals, showCompleted]);

  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardContent>
          Loading goals...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-md">
        <CardContent>
          Error: {error.message}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('Your Goals')}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleCreateGoal}>
            <Plus className="mr-2 h-4 w-4" />
            {t('Create Goal')}
          </Button>
        </CardHeader>
        <CardContent>
          {filteredGoals && filteredGoals.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {filteredGoals.map((goal: Goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <Target className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-500">
                {t('No goals created yet.')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Button variant="secondary" onClick={toggleShowCompleted}>
        {showCompleted ? t('Hide Completed') : t('Show Completed')}
      </Button>
    </div>
  );
};

export default SmartGoalsDashboard;

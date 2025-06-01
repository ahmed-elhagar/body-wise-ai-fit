
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Target, TrendingUp, Calendar } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Goal } from '@/types/goal';
import GoalCard from './GoalCard';

const SmartGoalsDashboard = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['user-goals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Goal[];
    },
    enabled: !!user?.id,
  });

  const handleCreateGoal = () => {
    setIsCreating(true);
    // Handle goal creation logic
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('goals.smartGoals')}
          </h1>
          <p className="text-gray-600">
            {t('goals.trackProgress')}
          </p>
        </div>
        <Button onClick={handleCreateGoal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t('goals.createGoal')}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center">
            <Target className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">{t('goals.totalGoals')}</p>
              <p className="text-2xl font-bold">{goals.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">{t('goals.completed')}</p>
              <p className="text-2xl font-bold">
                {goals.filter(g => g.current_value >= g.target_value).length}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <Calendar className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">{t('goals.thisMonth')}</p>
              <p className="text-2xl font-bold">
                {goals.filter(g => {
                  const created = new Date(g.created_at);
                  const now = new Date();
                  return created.getMonth() === now.getMonth() && 
                         created.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Grid */}
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('goals.noGoals')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('goals.createFirstGoal')}
            </p>
            <Button onClick={handleCreateGoal}>
              <Plus className="w-4 h-4 mr-2" />
              {t('goals.createGoal')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartGoalsDashboard;

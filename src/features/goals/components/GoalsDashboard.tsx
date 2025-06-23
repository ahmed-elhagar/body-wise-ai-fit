
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Trophy, Sparkles } from "lucide-react";
import { GoalCard } from './GoalCard';
import { GoalsOverview } from './GoalsOverview';
import { GoalCreationDialog } from './GoalCreationDialog';
import { GoalEditDialog } from './GoalEditDialog';
import { UpdateProgressDialog } from './UpdateProgressDialog';
import { useGoals } from "@/features/dashboard/hooks/useGoals";
import { Goal } from "../types";

const GoalsDashboard = () => {
  const { goals, isLoading, deleteGoal } = useGoals();
  const [showCreationDialog, setShowCreationDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Convert database goals to our Goal type with proper type casting
  const convertedGoals: Goal[] = goals.map(goal => ({
    ...goal,
    status: (goal.status as 'active' | 'completed' | 'paused') || 'active',
    difficulty: (goal.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
    priority: (goal.priority as 'low' | 'medium' | 'high') || 'medium',
    milestones: Array.isArray(goal.milestones) ? goal.milestones.map((m: any) => ({
      id: m.id || crypto.randomUUID(),
      title: m.title || '',
      target_value: m.target_value || 0,
      completed: m.completed || false,
      completed_at: m.completed_at || undefined
    })) : [],
    target_value: goal.target_value || 0,
    current_value: goal.current_value || 0,
    description: goal.description || '',
    notes: goal.notes || '',
    tags: goal.tags || []
  }));

  const activeGoals = convertedGoals.filter(goal => goal.status === 'active');
  const completedGoals = convertedGoals.filter(goal => goal.status === 'completed');

  const handleDeleteGoal = async (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(goalId);
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowEditDialog(true);
  };

  const handleUpdateProgress = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowProgressDialog(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-2xl border-0 shadow-xl">
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
                    Goals Dashboard
                  </h2>
                  <p className="text-white/80 text-lg">
                    Track your progress and achieve your fitness objectives
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <Trophy className="w-4 h-4 mr-2" />
                  {activeGoals.length} Active Goals
                </Badge>
                <Badge className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-white border-0 px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {completedGoals.length} Completed
                </Badge>
              </div>
            </div>
            
            <Button
              onClick={() => setShowCreationDialog(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 px-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Goal
            </Button>
          </div>
        </div>
      </div>

      {/* Overview */}
      <GoalsOverview />

      {/* Active Goals */}
      {activeGoals.length > 0 ? (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              Active Goals ({activeGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeGoals.map(goal => (
                <GoalCard 
                  key={goal.id} 
                  goal={goal}
                  onDelete={handleDeleteGoal}
                  onEdit={handleEditGoal}
                  onUpdateProgress={handleUpdateProgress}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl text-center p-12">
          <div className="space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto">
              <Target className="w-12 h-12 text-gray-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Active Goals</h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                Start your fitness journey by creating your first goal. Set realistic and achievable targets.
              </p>
            </div>
            <Button
              onClick={() => setShowCreationDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        </Card>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              Completed Goals ({completedGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedGoals.map(goal => (
                <GoalCard 
                  key={goal.id} 
                  goal={goal}
                  onDelete={handleDeleteGoal}
                  onEdit={handleEditGoal}
                  onUpdateProgress={handleUpdateProgress}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <GoalCreationDialog
        open={showCreationDialog}
        onOpenChange={setShowCreationDialog}
      />
      
      <GoalEditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        goal={selectedGoal}
      />
      
      <UpdateProgressDialog
        open={showProgressDialog}
        onOpenChange={setShowProgressDialog}
        goal={selectedGoal}
      />
    </div>
  );
};

export default GoalsDashboard;

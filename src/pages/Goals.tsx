
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import EnhancedGoalCard from "@/components/goals/EnhancedGoalCard";

const Goals = () => {
  // Mock goals data using the EnhancedGoalCard interface
  const mockGoals = [
    {
      id: '1',
      title: 'Lose 5kg',
      description: 'Reach target weight through healthy eating and exercise',
      target: 5,
      current: 3,
      unit: 'kg',
      deadline: '2024-12-31',
      category: 'weight' as const,
      priority: 'high' as const
    },
    {
      id: '2', 
      title: 'Workout 5x/week',
      description: 'Maintain consistent exercise routine',
      target: 5,
      current: 4,
      unit: 'workouts',
      deadline: '2024-12-31',
      category: 'exercise' as const,
      priority: 'medium' as const
    },
    {
      id: '3',
      title: 'Daily protein intake',
      description: 'Meet daily protein requirements',
      target: 150,
      current: 120,
      unit: 'g',
      deadline: '2024-12-31',
      category: 'nutrition' as const,
      priority: 'low' as const
    }
  ];

  const handleEditGoal = (goal: any) => {
    console.log('Edit goal:', goal);
  };

  const handleDeleteGoal = (id: string) => {
    console.log('Delete goal:', id);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Goals Dashboard</CardTitle>
                      <p className="text-blue-100">Track your fitness and health objectives</p>
                    </div>
                  </div>
                  <Button className="bg-white text-blue-600 hover:bg-blue-50">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Goal
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockGoals.map((goal) => (
                <EnhancedGoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Goals;

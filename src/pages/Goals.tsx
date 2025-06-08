
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import SmartGoalsDashboard from "@/components/goals/SmartGoalsDashboard";

const Goals = () => {
  // Mock goals data for now
  const mockGoals = [
    {
      id: '1',
      title: 'Lose 5kg',
      progress: 3,
      target: 5,
      goalType: 'weight' as const,
      deadline: '2024-12-31',
      description: 'Reach target weight through healthy eating and exercise'
    },
    {
      id: '2', 
      title: 'Workout 5x/week',
      progress: 4,
      target: 5,
      goalType: 'exercise' as const,
      description: 'Maintain consistent exercise routine'
    },
    {
      id: '3',
      title: 'Daily protein intake',
      progress: 120,
      target: 150,
      goalType: 'nutrition' as const,
      description: 'Meet daily protein requirements'
    }
  ];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-7xl mx-auto">
            <SmartGoalsDashboard goals={mockGoals} />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Goals;

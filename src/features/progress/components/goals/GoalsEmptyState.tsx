
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus } from "lucide-react";

interface GoalsEmptyStateProps {
  onCreateGoal: () => void;
}

export const GoalsEmptyState = ({ onCreateGoal }: GoalsEmptyStateProps) => {
  return (
    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
      <CardContent className="p-12 text-center">
        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Goals Set Yet</h3>
        <p className="text-gray-600 mb-6">
          Start your fitness journey by setting your first goal
        </p>
        <Button
          onClick={onCreateGoal}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Your First Goal
        </Button>
      </CardContent>
    </Card>
  );
};

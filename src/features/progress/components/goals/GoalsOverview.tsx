
import { Card, CardContent } from "@/components/ui/card";
import { Target, CheckCircle, Clock } from "lucide-react";

interface GoalsOverviewProps {
  totalGoals: number;
  completedGoals: number;
  activeGoals: number;
}

export const GoalsOverview = ({ totalGoals, completedGoals, activeGoals }: GoalsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6 text-center">
          <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-blue-900 mb-1">{totalGoals}</div>
          <div className="text-sm text-blue-600">Total Goals</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-green-900 mb-1">{completedGoals}</div>
          <div className="text-sm text-green-600">Completed</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-6 text-center">
          <Clock className="w-8 h-8 text-orange-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-orange-900 mb-1">{activeGoals}</div>
          <div className="text-sm text-orange-600">In Progress</div>
        </CardContent>
      </Card>
    </div>
  );
};

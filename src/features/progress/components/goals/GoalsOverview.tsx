
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Trophy } from "lucide-react";

interface GoalsOverviewProps {
  totalGoals: number;
  completedGoals: number;
  activeGoals: number;
}

export const GoalsOverview = ({ totalGoals, completedGoals, activeGoals }: GoalsOverviewProps) => {
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <TrendingUp className="w-5 h-5" />
          Goals Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/70 rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{totalGoals}</div>
            <div className="text-sm text-blue-600">Total Goals</div>
          </div>
          
          <div className="text-center p-4 bg-white/70 rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mx-auto mb-2">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{activeGoals}</div>
            <div className="text-sm text-orange-600">Active</div>
          </div>
          
          <div className="text-center p-4 bg-white/70 rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-2">
              <Trophy className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
            <div className="text-sm text-green-600">Completed</div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <div className="text-sm text-purple-600 mb-2">Completion Rate</div>
          <div className="text-3xl font-bold text-purple-800">{completionRate}%</div>
        </div>
      </CardContent>
    </Card>
  );
};

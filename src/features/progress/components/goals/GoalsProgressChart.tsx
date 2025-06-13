
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

interface GoalsProgressChartProps {
  overallProgress: number;
  completedGoals: number;
  totalGoals: number;
}

export const GoalsProgressChart = ({ overallProgress, completedGoals, totalGoals }: GoalsProgressChartProps) => {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <TrendingUp className="w-5 h-5" />
          Overall Goal Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-purple-700 font-medium">Completion Rate</span>
          <Badge className="bg-purple-600 text-white">
            {Math.round(overallProgress)}%
          </Badge>
        </div>
        <Progress value={overallProgress} className="h-3" />
        <div className="text-sm text-purple-600">
          {completedGoals} of {totalGoals} goals completed
        </div>
      </CardContent>
    </Card>
  );
};

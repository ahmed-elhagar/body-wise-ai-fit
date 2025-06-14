
import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";

interface GoalProgressRingProps {
  children?: React.ReactNode;
  progress?: number;
  size?: number;
}

const GoalProgressRing = ({ children, progress, size }: GoalProgressRingProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold">Goal Progress</h3>
      </div>
      <p className="text-gray-600">Goal progress visualization coming soon!</p>
      {children}
    </Card>
  );
};

export default GoalProgressRing;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Clock } from "lucide-react";

interface CompactTasksPanelProps {
  className?: string;
}

export const CompactTasksPanel = ({ className }: CompactTasksPanelProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Recent Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>No recent tasks</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CompactProgressSectionProps {
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isRestDay: boolean;
  selectedDayNumber: number;
}

export const CompactProgressSection = ({
  completedExercises,
  totalExercises,
  progressPercentage,
  isRestDay,
  selectedDayNumber
}: CompactProgressSectionProps) => {
  const { t } = useLanguage();

  if (isRestDay) {
    return (
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-center gap-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <div className="text-center">
            <h3 className="font-semibold text-blue-800">Rest Day</h3>
            <p className="text-sm text-blue-600">Day {selectedDayNumber} - Recovery time</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium">Day {selectedDayNumber} Progress</span>
          </div>
          <Badge variant={progressPercentage === 100 ? "default" : "secondary"}>
            {completedExercises}/{totalExercises} completed
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>
    </Card>
  );
};

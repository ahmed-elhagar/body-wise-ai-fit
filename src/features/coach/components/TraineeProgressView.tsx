
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp } from "lucide-react";

interface TraineeProgressViewProps {
  traineeId: string;
  traineeName: string;
  traineeProfile: any;
  onBack: () => void;
}

export const TraineeProgressView = ({ traineeId, traineeName, traineeProfile, onBack }: TraineeProgressViewProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-xl font-semibold">{traineeName} Progress</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Progress tracking coming soon</p>
            <p className="text-sm">Trainee ID: {traineeId}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

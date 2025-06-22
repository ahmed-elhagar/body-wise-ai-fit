
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Battery, Moon } from "lucide-react";

interface RecoveryMetricsProps {
  restingHeartRate?: number;
  sleepHours?: number;
  energyLevel: 'low' | 'medium' | 'high';
  recoveryScore: number;
}

export const RecoveryMetrics = ({
  restingHeartRate,
  sleepHours,
  energyLevel,
  recoveryScore
}: RecoveryMetricsProps) => {
  const getEnergyColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecoveryColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Recovery Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className={`text-3xl font-bold ${getRecoveryColor(recoveryScore)}`}>
            {recoveryScore}%
          </p>
          <p className="text-sm text-gray-600">Recovery Score</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {restingHeartRate && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm">Resting HR</span>
              </div>
              <span className="font-medium">{restingHeartRate} bpm</span>
            </div>
          )}

          {sleepHours && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Sleep</span>
              </div>
              <span className="font-medium">{sleepHours}h</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-green-500" />
              <span className="text-sm">Energy</span>
            </div>
            <Badge className={getEnergyColor(energyLevel)}>
              {energyLevel}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

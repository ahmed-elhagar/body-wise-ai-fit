
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Battery, Moon, Zap } from 'lucide-react';

interface RecoveryMetricsProps {
  energyLevel?: number;
  recoveryScore?: number;
  sleepQuality?: number;
  stressLevel?: number;
}

export const RecoveryMetrics: React.FC<RecoveryMetricsProps> = ({
  energyLevel = 75,
  recoveryScore = 82,
  sleepQuality = 68,
  stressLevel = 30
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Recovery Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Recovery Score */}
          <div className={`p-4 rounded-lg ${getScoreBg(recoveryScore)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Overall Recovery</span>
              <Badge variant="secondary" className={getScoreColor(recoveryScore)}>
                {recoveryScore}%
              </Badge>
            </div>
            <Progress value={recoveryScore} className="h-2" />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Battery className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Energy Level</span>
              </div>
              <div className="text-2xl font-bold text-blue-900 mb-1">{energyLevel}%</div>
              <Progress value={energyLevel} className="h-1" />
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Sleep Quality</span>
              </div>
              <div className="text-2xl font-bold text-purple-900 mb-1">{sleepQuality}%</div>
              <Progress value={sleepQuality} className="h-1" />
            </div>
          </div>

          {/* Stress Level */}
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Stress Level</span>
            </div>
            <div className="flex items-center justify-between">
              <Progress value={stressLevel} className="h-2 flex-1 mr-3" />
              <span className="text-sm font-medium text-red-900">{stressLevel}%</span>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Recovery Recommendations</h4>
            <div className="space-y-2">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  Your recovery is good! Consider light activity today.
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  Improve sleep quality with better sleep hygiene.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

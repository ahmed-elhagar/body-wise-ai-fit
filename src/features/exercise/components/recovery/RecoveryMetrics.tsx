import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Moon, 
  Activity, 
  TrendingUp,
  Calendar,
  Lightbulb,
  Users
} from 'lucide-react';
import GradientCard from '@/shared/components/design-system/GradientCard';

interface RecoveryMetricsProps {
  revolutionMode?: boolean;
}

export const RecoveryMetrics: React.FC<RecoveryMetricsProps> = ({
  revolutionMode = false
}) => {
  return (
    <div className="space-y-6">
      <GradientCard variant="secondary" className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-white rounded-lg">
            <Heart className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Recovery Optimization</h3>
            <p className="text-white/80">AI-powered rest and recovery planning</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Moon className="h-5 w-5 text-white" />
              <span className="text-white font-medium">Sleep Score</span>
            </div>
            <div className="text-2xl font-bold text-white">8.2/10</div>
            <p className="text-white/70 text-sm">Excellent recovery</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="h-5 w-5 text-white" />
              <span className="text-white font-medium">HRV</span>
            </div>
            <div className="text-2xl font-bold text-white">45ms</div>
            <p className="text-white/70 text-sm">Good variability</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="h-5 w-5 text-white" />
              <span className="text-white font-medium">Stress Level</span>
            </div>
            <div className="text-2xl font-bold text-white">Low</div>
            <p className="text-white/70 text-sm">Ready to train</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-white" />
              <span className="text-white font-medium">Recovery</span>
            </div>
            <div className="text-2xl font-bold text-white">92%</div>
            <p className="text-white/70 text-sm">Fully recovered</p>
          </div>
        </div>
      </GradientCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="font-bold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-emerald-600" />
            Smart Schedule
          </h4>
          <div className="space-y-3">
            {[
              { day: 'Today', type: 'Upper Body Strength', intensity: 'High', recovery: 'Good' },
              { day: 'Tomorrow', type: 'Active Recovery', intensity: 'Low', recovery: 'Optimal' },
              { day: 'Thursday', type: 'Lower Body Power', intensity: 'High', recovery: 'Good' },
              { day: 'Friday', type: 'Cardio HIIT', intensity: 'Medium', recovery: 'Fair' }
            ].map((schedule, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{schedule.day}</div>
                  <div className="text-sm text-gray-600">{schedule.type}</div>
                </div>
                <div className="text-right">
                  <Badge className={`mb-1 ${
                    schedule.intensity === 'High' ? 'bg-red-100 text-red-800' :
                    schedule.intensity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {schedule.intensity}
                  </Badge>
                  <div className="text-xs text-gray-500">{schedule.recovery} recovery</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-bold mb-4 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
            Recovery Recommendations
          </h4>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Active Recovery</span>
              </div>
              <p className="text-sm text-blue-700">20-minute light yoga or walking recommended</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Moon className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Sleep Optimization</span>
              </div>
              <p className="text-sm text-green-700">Maintain 8+ hours sleep for optimal recovery</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800">Nutrition</span>
              </div>
              <p className="text-sm text-purple-700">Post-workout protein within 30 minutes</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}; 
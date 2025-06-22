
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Battery, Moon, Zap } from 'lucide-react';

export const RecoveryMetrics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold text-red-600">72</span>
            </div>
            <p className="text-sm text-gray-600">Resting HR</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Battery className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold text-green-600">85%</span>
            </div>
            <p className="text-sm text-gray-600">Recovery</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Moon className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">7.5h</span>
            </div>
            <p className="text-sm text-gray-600">Sleep</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600">92%</span>
            </div>
            <p className="text-sm text-gray-600">Readiness</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recovery Insights (Coming Soon)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Advanced Recovery Tracking
            </h3>
            <p className="text-gray-600">
              Connect wearable devices to track heart rate variability, sleep quality, and recovery metrics.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

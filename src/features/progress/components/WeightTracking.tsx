
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, TrendingUp, Target, Calendar } from 'lucide-react';

const WeightTracking = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Scale className="h-8 w-8 text-brand-primary-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weight Tracking</h1>
          <p className="text-gray-600">Monitor your weight progress over time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Current Weight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary-600 mb-2">-- kg</div>
            <p className="text-sm text-gray-600">No data recorded yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goal Weight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">-- kg</div>
            <p className="text-sm text-gray-600">Set your target weight</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">0%</div>
            <p className="text-sm text-gray-600">Towards your goal</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weight History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No weight entries recorded yet</p>
            <p className="text-sm text-gray-500">Start tracking your weight to see progress over time</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightTracking;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Plus, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GoalsPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="h-8 w-8 text-brand-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fitness Goals</h1>
            <p className="text-gray-600">Set and track your fitness objectives</p>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Weight Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Target weight management</p>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-500">No goal set yet</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Fitness Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Overall fitness objective</p>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-500">No goal set yet</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Goal achievement timeline</p>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-500">No timeline set</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Goal Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No active goals found</p>
            <p className="text-sm text-gray-500">Create your first goal to start tracking your progress</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsPage;

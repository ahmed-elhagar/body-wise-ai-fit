
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { GoalProgressRing } from "./GoalProgressRing";

const GoalsOverview = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Goals</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Weight Loss
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GoalProgressRing progress={65} size={120} />
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">65% Complete</p>
              <p className="text-xs text-gray-500">5kg lost of 8kg target</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <div className="text-center text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No active goals</p>
              <Button variant="outline" size="sm" className="mt-2">
                Create Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoalsOverview;

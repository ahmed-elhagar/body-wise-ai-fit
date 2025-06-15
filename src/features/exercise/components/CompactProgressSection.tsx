
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Trophy, Target } from "lucide-react";

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
  if (isRestDay) {
    return (
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900">Rest Day</h3>
              <p className="text-sm text-blue-700">Recovery & Rejuvenation</p>
            </div>
          </div>
          <Badge className="bg-blue-500 text-white">Day {selectedDayNumber}</Badge>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-green-900">Day {selectedDayNumber} Progress</h3>
              <p className="text-sm text-green-700">{completedExercises} of {totalExercises} completed</p>
            </div>
          </div>
          <Badge className={`${progressPercentage === 100 ? 'bg-green-500' : 'bg-orange-500'} text-white`}>
            {Math.round(progressPercentage)}%
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-green-700">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-green-100" />
        </div>
      </div>
    </Card>
  );
};

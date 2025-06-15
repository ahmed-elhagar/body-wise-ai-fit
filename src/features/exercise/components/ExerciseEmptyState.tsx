
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Sparkles, Calendar, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseEmptyStateProps {
  onGenerateProgram: () => void;
  workoutType: "home" | "gym";
  dailyWorkoutId: string;
}

export const ExerciseEmptyState = ({ 
  onGenerateProgram, 
  workoutType 
}: ExerciseEmptyStateProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Main Empty State */}
      <Card className="p-8 text-center bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Dumbbell className="w-10 h-10 text-white" />
        </div>
        
        <div className="space-y-4 max-w-md mx-auto">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Exercises Available
            </h2>
            <p className="text-gray-600 leading-relaxed">
              No exercises are scheduled for this day. Generate a personalized workout program to get started with your fitness journey.
            </p>
          </div>

          <Button
            onClick={onGenerateProgram}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Exercise Program
          </Button>
        </div>
      </Card>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
          <p className="text-sm text-gray-600">
            Personalized workouts based on your goals and fitness level
          </p>
        </Card>

        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Structured Plan</h3>
          <p className="text-sm text-gray-600">
            4-week progressive programs with daily workout schedules
          </p>
        </Card>

        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Goal-Oriented</h3>
          <p className="text-sm text-gray-600">
            Workouts tailored to your specific fitness objectives
          </p>
        </Card>
      </div>

      {/* Workout Type Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {workoutType === 'gym' ? '🏋️' : '🏠'}
            </span>
          </div>
          <div>
            <p className="font-medium text-blue-900">
              {workoutType === 'gym' ? 'Gym Workout' : 'Home Workout'} Mode
            </p>
            <p className="text-sm text-blue-700">
              Exercises will be optimized for {workoutType === 'gym' ? 'gym equipment' : 'home workouts with minimal equipment'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

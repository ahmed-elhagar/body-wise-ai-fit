
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Sparkles, Calendar, Target, Zap, Users, Trophy } from "lucide-react";
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
    <div className="space-y-8">
      {/* Main Empty State Hero */}
      <Card className="p-8 text-center bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200 relative overflow-hidden">
        <div className="absolute top-4 right-4">
          <Sparkles className="w-8 h-8 text-blue-300 opacity-30" />
        </div>
        
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
          <Dumbbell className="w-12 h-12 text-white" />
        </div>
        
        <div className="space-y-6 max-w-lg mx-auto">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Fitness Journey?
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              No exercises are scheduled for today. Let's create a personalized workout program that fits your goals, schedule, and fitness level.
            </p>
          </div>

          <Button
            onClick={onGenerateProgram}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate My Workout Program
          </Button>
        </div>
      </Card>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center hover:shadow-lg transition-all duration-200 group">
          <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
            <Zap className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2 text-lg">AI-Powered</h3>
          <p className="text-gray-600 leading-relaxed">
            Personalized workouts created by advanced AI based on your unique goals and fitness level
          </p>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-all duration-200 group">
          <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2 text-lg">Structured Planning</h3>
          <p className="text-gray-600 leading-relaxed">
            4-week progressive programs with daily schedules that evolve with your progress
          </p>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-all duration-200 group">
          <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
            <Target className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2 text-lg">Goal-Focused</h3>
          <p className="text-gray-600 leading-relaxed">
            Every workout is designed to get you closer to your specific fitness objectives
          </p>
        </Card>
      </div>

      {/* Workout Type Info */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg font-bold">
              {workoutType === 'gym' ? '🏋️' : '🏠'}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 mb-2 text-lg">
              {workoutType === 'gym' ? 'Gym Workout Mode' : 'Home Workout Mode'}
            </h3>
            <p className="text-blue-700 leading-relaxed">
              Your exercises will be optimized for {workoutType === 'gym' ? 'gym equipment and facilities' : 'home workouts with minimal equipment'}. 
              You can change this preference anytime in your settings.
            </p>
          </div>
        </div>
      </Card>

      {/* Social Proof */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-green-800">Join Thousands of Success Stories</h3>
            <p className="text-green-700">Our AI-powered programs have helped users achieve amazing results</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-800">15k+</div>
            <div className="text-sm text-green-600">Active Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-800">89%</div>
            <div className="text-sm text-green-600">See Results</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-800">4.8★</div>
            <div className="text-sm text-green-600">User Rating</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

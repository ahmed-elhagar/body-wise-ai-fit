import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Timer, 
  Award, 
  Flame,
  TrendingUp,
  Calendar,
  BarChart3
} from 'lucide-react';
import GradientCard from '@/shared/components/design-system/GradientCard';
import StatsCard from '@/shared/components/design-system/StatsCard';
import { ExerciseProgram } from '../../types';

interface ProgressTrackerProps {
  currentProgram?: ExerciseProgram;
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  workoutTimer: number;
  revolutionMode?: boolean;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentProgram,
  completedExercises,
  totalExercises,
  progressPercentage,
  workoutTimer,
  revolutionMode = false
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressStats = [
    {
      title: "Today's Progress",
      value: `${completedExercises}/${totalExercises}`,
      subtitle: "Exercises completed",
      icon: Target,
      trend: progressPercentage > 50 ? "up" : "stable",
      color: "primary" as const
    },
    {
      title: "Workout Time",
      value: formatTime(workoutTimer),
      subtitle: "Minutes active",
      icon: Timer,
      trend: "up" as const,
      color: "secondary" as const
    },
    {
      title: "Weekly Goal",
      value: "4/5",
      subtitle: "Workouts this week",
      icon: Award,
      trend: "up" as const,
      color: "accent" as const
    },
    {
      title: "Streak",
      value: "12",
      subtitle: "Days active",
      icon: Flame,
      trend: "up" as const,
      color: "success" as const
    }
  ];

  const weeklyProgress = [
    { day: 'Mon', completed: true, exercises: 8 },
    { day: 'Tue', completed: true, exercises: 6 },
    { day: 'Wed', completed: false, exercises: 7 },
    { day: 'Thu', completed: false, exercises: 5 },
    { day: 'Fri', completed: false, exercises: 8 },
    { day: 'Sat', completed: false, exercises: 0 }, // Rest day
    { day: 'Sun', completed: false, exercises: 6 }
  ];

  if (revolutionMode) {
    return (
      <div className="space-y-6">
        <GradientCard variant="primary" className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-white rounded-lg">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Progress Analytics</h3>
              <p className="text-white/80">Intelligent performance tracking and insights</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {progressStats.map((stat, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <stat.icon className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">{stat.title}</span>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-white/70 text-sm">{stat.subtitle}</p>
              </div>
            ))}
          </div>
        </GradientCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h4 className="font-bold mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Performance Trends
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Strength Progress</span>
                  <span>+15%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Endurance</span>
                  <span>+8%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Consistency</span>
                  <span>+22%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="font-bold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Weekly Overview
            </h4>
            <div className="grid grid-cols-7 gap-2">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs font-medium text-gray-600 mb-2">{day.day}</div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    day.completed 
                      ? 'bg-green-500 text-white' 
                      : day.exercises === 0 
                      ? 'bg-gray-200 text-gray-500'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {day.exercises || 'R'}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {progressStats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            variant="soft"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Weekly Progress</h4>
          <div className="space-y-3">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    day.completed ? 'bg-green-500' : day.exercises === 0 ? 'bg-gray-300' : 'bg-blue-500'
                  }`}></div>
                  <span className="font-medium">{day.day}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {day.exercises === 0 ? 'Rest Day' : `${day.exercises} exercises`}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-semibold mb-4">Current Program</h4>
          {currentProgram ? (
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Program Name</span>
                <p className="font-medium">{currentProgram.program_name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Difficulty</span>
                <p className="font-medium">{currentProgram.difficulty_level}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Type</span>
                <p className="font-medium">{currentProgram.workout_type}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Week</span>
                <p className="font-medium">{currentProgram.current_week || 1}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No active program</p>
          )}
        </Card>
      </div>
    </div>
  );
};
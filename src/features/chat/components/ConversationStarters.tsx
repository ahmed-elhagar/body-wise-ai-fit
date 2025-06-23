
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Apple, Target, TrendingUp, Calendar, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversationStartersProps {
  onStarterClick: (message: string) => void;
  className?: string;
}

const ConversationStarters = ({ onStarterClick, className }: ConversationStartersProps) => {
  const starters = [
    {
      icon: Dumbbell,
      title: "Workout Plan",
      message: "Create a workout plan for my fitness goals",
      gradient: "from-orange-500 to-red-500",
      description: "Get a personalized exercise routine"
    },
    {
      icon: Apple,
      title: "Nutrition Advice",
      message: "Help me plan healthy meals for weight loss",
      gradient: "from-green-500 to-emerald-500",
      description: "Discover healthy eating strategies"
    },
    {
      icon: Target,
      title: "Set Goals",
      message: "Help me set realistic fitness goals",
      gradient: "from-blue-500 to-purple-500",
      description: "Create achievable milestones"
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      message: "How can I track my fitness progress effectively?",
      gradient: "from-purple-500 to-pink-500",
      description: "Monitor your improvements"
    },
    {
      icon: Calendar,
      title: "Daily Routine",
      message: "Design a daily health and fitness routine",
      gradient: "from-cyan-500 to-blue-500",
      description: "Build consistent habits"
    },
    {
      icon: Heart,
      title: "Wellness Tips",
      message: "Share tips for overall health and wellness",
      gradient: "from-pink-500 to-rose-500",
      description: "Improve your wellbeing"
    }
  ];

  return (
    <div className={cn("w-full", className)}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Quick Start Conversations
        </h3>
        <p className="text-gray-600 text-sm">
          Choose a topic below or ask anything about fitness and nutrition
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {starters.map((starter, index) => (
          <Card 
            key={index}
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm"
            onClick={() => onStarterClick(starter.message)}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r shadow-lg group-hover:shadow-xl transition-all duration-300",
                  starter.gradient
                )}>
                  <starter.icon className="h-5 w-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                    {starter.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {starter.description}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-xs text-gray-500 hover:text-gray-700 font-normal"
                  >
                    Click to start →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          💡 <strong>Pro tip:</strong> Be specific about your goals, current fitness level, and any limitations for better personalized advice!
        </p>
      </div>
    </div>
  );
};

export default ConversationStarters;

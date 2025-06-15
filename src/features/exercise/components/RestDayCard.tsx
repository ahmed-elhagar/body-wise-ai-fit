
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Moon, Heart, Bed, Coffee, Book, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const RestDayCard = () => {
  const { t } = useLanguage();

  const restActivities = [
    {
      icon: <Bed className="w-6 h-6" />,
      title: "Quality Sleep",
      description: "Aim for 7-9 hours of restful sleep tonight",
      color: "bg-purple-100 text-purple-700 border-purple-200"
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: "Stay Hydrated",
      description: "Drink plenty of water throughout the day",
      color: "bg-blue-100 text-blue-700 border-blue-200"
    },
    {
      icon: <Book className="w-6 h-6" />,
      title: "Light Activities",
      description: "Gentle stretching, reading, or meditation",
      color: "bg-green-100 text-green-700 border-green-200"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Self Care",
      description: "Focus on nutrition and mental wellness",
      color: "bg-pink-100 text-pink-700 border-pink-200"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Rest Day Hero */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 text-center overflow-hidden relative">
        <div className="absolute top-4 right-4">
          <Sparkles className="w-8 h-8 text-blue-300 opacity-50" />
        </div>
        
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Moon className="w-12 h-12 text-white" />
        </div>
        
        <div className="space-y-4 max-w-md mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Rest & Recovery Day
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Your muscles grow stronger during rest. Today is about recovery, rejuvenation, and preparing for tomorrow's challenges.
            </p>
          </div>

          <Badge className="bg-blue-500 text-white px-6 py-2 text-sm font-medium">
            <Moon className="w-4 h-4 mr-2" />
            Recovery Mode Active
          </Badge>
        </div>
      </Card>

      {/* Recovery Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {restActivities.map((activity, index) => (
          <Card key={index} className={`p-6 hover:shadow-lg transition-all duration-200 border-2 ${activity.color}`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {activity.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">
                  {activity.title}
                </h3>
                <p className="text-sm opacity-90">
                  {activity.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recovery Tips Card */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Recovery Best Practices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
          <div className="space-y-2">
            <p>• Listen to your body and rest completely</p>
            <p>• Focus on protein-rich nutrition</p>
            <p>• Stay hydrated throughout the day</p>
          </div>
          <div className="space-y-2">
            <p>• Light stretching or gentle yoga</p>
            <p>• Avoid intense physical activities</p>
            <p>• Get quality sleep tonight</p>
          </div>
        </div>
      </Card>

      {/* Tomorrow Preview */}
      <Card className="p-4 bg-gray-50 border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Coming Up Tomorrow</p>
            <p className="text-gray-800 font-bold">Back to Training</p>
          </div>
          <Button variant="outline" size="sm" className="text-gray-600 hover:bg-white">
            Preview Tomorrow's Workout
          </Button>
        </div>
      </Card>
    </div>
  );
};


import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Moon, Heart, Bed, Coffee, Book } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const RestDayCard = () => {
  const { t } = useLanguage();

  const restActivities = [
    {
      icon: <Bed className="w-5 h-5" />,
      title: "Quality Sleep",
      description: "Aim for 7-9 hours of restful sleep",
      color: "bg-purple-100 text-purple-700"
    },
    {
      icon: <Coffee className="w-5 h-5" />,
      title: "Stay Hydrated",
      description: "Drink plenty of water throughout the day",
      color: "bg-blue-100 text-blue-700"
    },
    {
      icon: <Book className="w-5 h-5" />,
      title: "Light Reading",
      description: "Relax with a good book or gentle stretching",
      color: "bg-green-100 text-green-700"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Self Care",
      description: "Focus on nutrition and mental wellness",
      color: "bg-pink-100 text-pink-700"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Rest Day Card */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Moon className="w-10 h-10 text-white" />
        </div>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Rest Day
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Your body needs time to recover and rebuild. Today is all about rest and recovery.
            </p>
          </div>

          <Badge className="bg-blue-500 text-white px-4 py-2 text-sm">
            <Moon className="w-4 h-4 mr-2" />
            Recovery Mode Active
          </Badge>
        </div>
      </Card>

      {/* Recovery Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {restActivities.map((activity, index) => (
          <Card key={index} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${activity.color}`}>
                {activity.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {activity.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {activity.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recovery Tips */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Recovery Tips
        </h3>
        <div className="space-y-2 text-sm text-green-700">
          <p>• Listen to your body and get adequate rest</p>
          <p>• Focus on nutrition with plenty of protein</p>
          <p>• Stay hydrated and avoid intense physical activity</p>
          <p>• Light stretching or gentle yoga is beneficial</p>
        </div>
      </Card>

      {/* Tomorrow Preview */}
      <Card className="p-4 bg-gray-50 border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Coming Up Tomorrow</p>
            <p className="text-gray-800 font-semibold">Back to Training</p>
          </div>
          <Button variant="outline" size="sm" className="text-gray-600">
            Preview Tomorrow
          </Button>
        </div>
      </Card>
    </div>
  );
};

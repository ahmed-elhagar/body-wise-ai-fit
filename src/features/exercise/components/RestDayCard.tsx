
import { Card } from "@/components/ui/card";
import { Heart, Coffee, Bed } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const RestDayCard = () => {
  const { t } = useLanguage();

  const restActivities = [
    {
      icon: Heart,
      title: "Recovery",
      description: "Let your muscles repair and grow stronger"
    },
    {
      icon: Coffee,
      title: "Hydration",
      description: "Stay hydrated and maintain good nutrition"
    },
    {
      icon: Bed,
      title: "Rest",
      description: "Get quality sleep for optimal recovery"
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8 text-white" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-2">Rest Day</h2>
          <p className="text-blue-600">
            Take this time to recover and prepare for your next workout
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {restActivities.map((activity, index) => (
            <div key={index} className="bg-white/70 rounded-lg p-4 text-center">
              <activity.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800 mb-1">{activity.title}</h3>
              <p className="text-sm text-blue-600">{activity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

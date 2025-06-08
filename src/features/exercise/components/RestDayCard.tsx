
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Heart, 
  Droplets, 
  Moon, 
  Utensils, 
  BookOpen,
  Play,
  Coffee
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RestDayCardProps {
  onStartLightActivity?: () => void;
}

export const RestDayCard = ({ onStartLightActivity }: RestDayCardProps) => {
  const { t } = useLanguage();

  const restActivities = [
    {
      icon: <Moon className="w-5 h-5" />,
      title: t('Quality Sleep'),
      description: t('Aim for 7-9 hours of restorative sleep'),
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      title: t('Stay Hydrated'),
      description: t('Drink plenty of water throughout the day'),
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: <Utensils className="w-5 h-5" />,
      title: t('Proper Nutrition'),
      description: t('Focus on protein and nutrients for recovery'),
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: t('Light Reading'),
      description: t('Relax your mind with a good book'),
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Main Rest Day Header */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-10 h-10 text-white" />
          </div>
          
          <Badge className="bg-blue-500 text-white mb-3">
            {t('Rest Day')}
          </Badge>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('Time to Recover')}
          </h2>
          
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            {t('Your body grows stronger during rest. Take today to recover, hydrate, and prepare for tomorrow\'s workout.')}
          </p>
        </div>
      </Card>

      {/* Recovery Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {restActivities.map((activity, index) => (
          <Card 
            key={index}
            className="p-4 hover:shadow-md transition-shadow bg-white border-gray-200"
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${activity.color} flex items-center justify-center text-white flex-shrink-0`}>
                {activity.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {activity.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {activity.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Optional Light Activity */}
      <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {t('Light Activity')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('Optional gentle stretching or walking')}
              </p>
            </div>
          </div>
          
          {onStartLightActivity && (
            <Button
              onClick={onStartLightActivity}
              variant="outline"
              size="sm"
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <Play className="w-4 h-4 mr-2" />
              {t('Start')}
            </Button>
          )}
        </div>
      </Card>

      {/* Recovery Tips */}
      <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-start gap-3">
          <Coffee className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-2">
              {t('Recovery Tips')}
            </h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• {t('Listen to your body and rest when needed')}</li>
              <li>• {t('Consider light stretching or yoga')}</li>
              <li>• {t('Plan your next workout sessions')}</li>
              <li>• {t('Reflect on your fitness progress')}</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RestDayCard;

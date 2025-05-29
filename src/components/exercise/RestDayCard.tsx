
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, Zap, BookOpen, Coffee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const RestDayCard = () => {
  const { t } = useLanguage();

  const restActivities = [
    {
      icon: Heart,
      title: t('exercise.lightStretching') || 'Light Stretching',
      description: t('exercise.stretchingDesc') || 'Gentle stretches to maintain flexibility',
      color: 'text-pink-600 bg-pink-50'
    },
    {
      icon: Coffee,
      title: t('exercise.meditation') || 'Meditation',
      description: t('exercise.meditationDesc') || 'Mindfulness and relaxation exercises',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      icon: Zap,
      title: t('exercise.lightWalk') || 'Light Walk',
      description: t('exercise.walkDesc') || 'Easy-paced walk for active recovery',
      color: 'text-green-600 bg-green-50'
    },
    {
      icon: BookOpen,
      title: t('exercise.readFitness') || 'Fitness Education',
      description: t('exercise.readDesc') || 'Learn about nutrition and fitness',
      color: 'text-blue-600 bg-blue-50'
    }
  ];

  return (
    <div className="lg:col-span-3">
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-orange-50 via-orange-25 to-yellow-50 border-orange-200 shadow-lg">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                {t('exercise.restDay') || 'Rest Day'}
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                {t('exercise.restDayMessage') || 'Your body needs time to recover and rebuild. Use this day to focus on recovery and light activities.'}
              </p>
            </div>
          </div>

          {/* Recovery Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {restActivities.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div key={index} className="p-4 bg-white/80 rounded-lg border border-orange-100 hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 rounded-lg ${activity.color} flex items-center justify-center mb-3 mx-auto`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{activity.title}</h3>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
              );
            })}
          </div>

          {/* Motivational Quote */}
          <div className="bg-white/60 p-4 rounded-lg border border-orange-100 max-w-lg mx-auto">
            <p className="text-sm italic text-gray-700 mb-2">
              "{t('exercise.restQuote') || 'Rest when you\'re weary. Refresh and renew yourself, your body, your mind, your spirit.'}"
            </p>
            <p className="text-xs text-gray-500">- Ralph Marston</p>
          </div>

          {/* Recovery Checklist */}
          <div className="text-left max-w-md mx-auto">
            <h3 className="font-semibold text-gray-800 mb-3 text-center">
              {t('exercise.recoveryChecklist') || 'Recovery Checklist'}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">{t('exercise.checkHydration') || 'Stay hydrated (8+ glasses of water)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">{t('exercise.checkSleep') || 'Get 7-9 hours of quality sleep'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">{t('exercise.checkNutrition') || 'Focus on nutritious meals'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">{t('exercise.checkStress') || 'Manage stress levels'}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

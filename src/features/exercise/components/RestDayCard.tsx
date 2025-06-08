
import { Coffee, Heart, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export const RestDayCard = () => {
  const { t } = useLanguage();

  return (
    <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Coffee className="w-8 h-8 text-blue-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {t('exercise.restDay.title', 'Rest Day')}
      </h3>
      
      <p className="text-gray-600 mb-6">
        {t('exercise.restDay.description', 'Today is your rest day. Take time to recover and recharge for your next workout.')}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2 justify-center p-3 bg-white rounded-lg">
          <Heart className="w-5 h-5 text-red-500" />
          <span className="text-sm text-gray-700">
            {t('exercise.restDay.recover', 'Muscle Recovery')}
          </span>
        </div>
        
        <div className="flex items-center gap-2 justify-center p-3 bg-white rounded-lg">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-gray-700">
            {t('exercise.restDay.energy', 'Energy Restoration')}
          </span>
        </div>
        
        <div className="flex items-center gap-2 justify-center p-3 bg-white rounded-lg">
          <Coffee className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-700">
            {t('exercise.restDay.relax', 'Mental Relaxation')}
          </span>
        </div>
      </div>
    </Card>
  );
};

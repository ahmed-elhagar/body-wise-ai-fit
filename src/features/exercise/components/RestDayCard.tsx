
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Coffee, 
  Leaf, 
  Smile,
  Youtube,
  BookOpen,
  Sparkles
} from "lucide-react";

export const RestDayCard = () => {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-fitness-primary-50 via-white to-fitness-secondary-50 border-0 shadow-xl">
      <div className="p-8 text-center">
        {/* Header Section */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-fitness-primary-500 to-fitness-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-fitness-primary-800 mb-3">
            Rest Day
          </h2>
          <p className="text-lg text-fitness-primary-600 leading-relaxed max-w-md mx-auto">
            Today is your rest day. Time to recover, recharge, and prepare for tomorrow's workout!
          </p>
          <Badge className="mt-4 bg-fitness-primary-100 text-fitness-primary-700 border-fitness-primary-200">
            <Sparkles className="w-3 h-3 mr-1" />
            Recovery Mode
          </Badge>
        </div>

        {/* Recovery Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 rounded-2xl p-6 border border-fitness-neutral-200/50 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-fitness-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Coffee className="w-6 h-6 text-fitness-accent-600" />
            </div>
            <h3 className="font-bold text-fitness-primary-800 mb-2">Relax</h3>
            <p className="text-sm text-fitness-primary-600">
              Take time to unwind and let your muscles recover
            </p>
          </div>

          <div className="bg-white/80 rounded-2xl p-6 border border-fitness-neutral-200/50 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-fitness-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-6 h-6 text-fitness-secondary-600" />
            </div>
            <h3 className="font-bold text-fitness-primary-800 mb-2">Nutrition</h3>
            <p className="text-sm text-fitness-primary-600">
              Focus on proper nutrition to fuel your recovery
            </p>
          </div>

          <div className="bg-white/80 rounded-2xl p-6 border border-fitness-neutral-200/50 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-fitness-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Smile className="w-6 h-6 text-fitness-orange-600" />
            </div>
            <h3 className="font-bold text-fitness-primary-800 mb-2">Mindfulness</h3>
            <p className="text-sm text-fitness-primary-600">
              Practice meditation or gentle stretching
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-fitness-primary-300 text-fitness-primary-700 hover:bg-fitness-primary-50 hover:border-fitness-primary-400 font-semibold rounded-xl px-6"
            onClick={() => window.open('https://www.youtube.com/results?search_query=gentle+stretching+routine', '_blank')}
          >
            <Youtube className="w-5 h-5 mr-2" />
            Stretching Videos
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            className="border-2 border-fitness-secondary-300 text-fitness-secondary-700 hover:bg-fitness-secondary-50 hover:border-fitness-secondary-400 font-semibold rounded-xl px-6"
            onClick={() => window.open('https://www.youtube.com/results?search_query=meditation+relaxation', '_blank')}
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Meditation
          </Button>
        </div>

        {/* Recovery Tips */}
        <div className="mt-8 p-6 bg-white/60 rounded-2xl border border-fitness-neutral-200/30">
          <h4 className="font-semibold text-fitness-primary-800 mb-3">💡 Recovery Tips</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-fitness-primary-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-fitness-primary-500 rounded-full"></div>
              Stay hydrated throughout the day
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-fitness-secondary-500 rounded-full"></div>
              Get 7-9 hours of quality sleep
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-fitness-accent-500 rounded-full"></div>
              Do light activities like walking
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-fitness-orange-500 rounded-full"></div>
              Practice stress management
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

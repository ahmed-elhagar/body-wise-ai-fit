
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Youtube, BookOpen, Smile } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

export const RestDayCard = () => {
  const { t } = useI18n();

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 text-center">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto">
          <Calendar className="w-8 h-8 text-orange-600" />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-orange-800 mb-2">
            Rest Day 🛌
          </h3>
          <p className="text-orange-700 mb-4">
            Your body needs time to recover and grow stronger!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            className="h-12 text-orange-700 border-orange-300 hover:bg-orange-100"
            onClick={() => window.open('https://www.youtube.com/results?search_query=gentle+stretching+routine', '_blank')}
          >
            <Youtube className="w-4 h-4 mr-2" />
            Stretching
          </Button>
          
          <Button 
            variant="outline"
            className="h-12 text-purple-700 border-purple-300 hover:bg-purple-100"
            onClick={() => window.open('https://www.youtube.com/results?search_query=meditation+relaxation', '_blank')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Meditation
          </Button>

          <Button 
            variant="outline"
            className="h-12 text-green-700 border-green-300 hover:bg-green-100"
            onClick={() => window.open('https://www.youtube.com/results?search_query=light+walk+recovery', '_blank')}
          >
            <Smile className="w-4 h-4 mr-2" />
            Light Walk
          </Button>
        </div>

        <div className="pt-3 border-t border-orange-200">
          <p className="text-xs text-orange-600">
            💡 Tip: Use this time for meal prep or planning your next workout!
          </p>
        </div>
      </div>
    </Card>
  );
};

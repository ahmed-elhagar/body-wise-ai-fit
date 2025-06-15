
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
  Sparkles,
  Droplets,
  Moon,
  Zap
} from "lucide-react";

export const RestDayCard = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.08),transparent_50%)]"></div>
      
      <Card className="relative border-0 bg-white/60 backdrop-blur-sm shadow-xl">
        <div className="p-8 text-center">
          {/* Floating Elements */}
          <div className="absolute top-4 left-4 w-16 h-16 bg-orange-100/50 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 right-4 w-20 h-20 bg-amber-100/50 rounded-full blur-xl"></div>
          
          {/* Header Section */}
          <div className="mb-8 relative">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl relative">
              <Heart className="w-10 h-10 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-300/30 to-transparent rounded-full"></div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-3">
              Rest & Recovery Day
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-md mx-auto">
              Your muscles grow stronger during rest. Today is about recovery and preparation for tomorrow's challenge!
            </p>
            <Badge className="mt-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-lg">
              <Sparkles className="w-3 h-3 mr-1" />
              Recovery Mode Active
            </Badge>
          </div>

          {/* Recovery Activities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Hydrate</h3>
              <p className="text-sm text-gray-600">
                Drink plenty of water to aid muscle recovery
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Nutrition</h3>
              <p className="text-sm text-gray-600">
                Focus on protein and nutrients for recovery
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Moon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Sleep</h3>
              <p className="text-sm text-gray-600">
                Get 7-9 hours of quality sleep tonight
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Gentle Activity</h3>
              <p className="text-sm text-gray-600">
                Light walking or stretching
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 font-semibold rounded-xl px-6 bg-white/70 backdrop-blur-sm shadow-lg"
              onClick={() => window.open('https://www.youtube.com/results?search_query=gentle+stretching+routine', '_blank')}
            >
              <Youtube className="w-5 h-5 mr-2" />
              Stretching Videos
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 font-semibold rounded-xl px-6 bg-white/70 backdrop-blur-sm shadow-lg"
              onClick={() => window.open('https://www.youtube.com/results?search_query=meditation+relaxation', '_blank')}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Meditation
            </Button>
          </div>

          {/* Recovery Tips */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-orange-100/50 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Coffee className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-gray-800">Recovery Checklist</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Stay hydrated (8+ glasses)</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Eat protein-rich meals</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Take a warm bath/shower</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Practice deep breathing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

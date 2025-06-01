
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Sparkles, Dumbbell, Calendar, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExercisePageHeaderProps {
  currentProgram: any;
  workoutType: "home" | "gym";
  onShowAIDialog: () => void;
  onRegenerateProgram: () => void;
  isGenerating: boolean;
}

export const ExercisePageHeader = ({
  currentProgram,
  workoutType,
  onShowAIDialog,
  onRegenerateProgram,
  isGenerating
}: ExercisePageHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 rounded-2xl" />
      
      <Card className="relative p-4 md:p-6 border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
        {/* Decorative elements - smaller for mobile */}
        <div className="absolute top-2 right-2 md:top-4 md:right-4 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
        <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-xl" />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Header Content - More compact */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Dumbbell className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Exercise Program
                  </h1>
                  <p className="text-sm md:text-base text-gray-600 font-medium">
                    AI-Powered Personalized Fitness
                  </p>
                </div>
              </div>

              {/* Program Details - More compact */}
              {currentProgram && (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-3 py-1 text-xs md:text-sm font-semibold shadow-md"
                  >
                    <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    Week {currentProgram.current_week || 1}
                  </Badge>
                  
                  <Badge 
                    variant="outline" 
                    className="bg-white/80 border-gray-200 text-gray-700 px-3 py-1 text-xs md:text-sm font-medium"
                  >
                    <Target className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    {currentProgram.difficulty_level || 'Intermediate'}
                  </Badge>
                  
                  <Badge 
                    variant="outline" 
                    className="bg-green-50 border-green-200 text-green-700 px-3 py-1 text-xs md:text-sm font-medium"
                  >
                    {currentProgram.program_name || `${workoutType === 'home' ? 'Home' : 'Gym'} Program`}
                  </Badge>
                </div>
              )}
            </div>

            {/* Action Buttons - More compact */}
            {currentProgram && (
              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                <Button
                  onClick={onShowAIDialog}
                  disabled={isGenerating}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Customize
                </Button>
                
                <Button 
                  onClick={onRegenerateProgram}
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                  className="bg-white/90 hover:bg-white border-gray-200 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Generate New
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

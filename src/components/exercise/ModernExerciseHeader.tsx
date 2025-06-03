
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Sparkles, Dumbbell, Calendar, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ModernExerciseHeaderProps {
  currentProgram: any;
  onShowAIDialog: () => void;
  onRegenerateProgram: () => void;
  isGenerating: boolean;
}

export const ModernExerciseHeader = ({
  currentProgram,
  onShowAIDialog,
  onRegenerateProgram,
  isGenerating
}: ModernExerciseHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="px-3 py-4">
      <div className="space-y-4">
        {/* Main Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Section - Program Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Exercise Program
              </h1>
              <p className="text-gray-600 font-medium">
                AI-Powered Personalized Fitness Journey
              </p>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onShowAIDialog}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Customize Program
            </Button>
            
            <Button 
              onClick={onRegenerateProgram}
              disabled={isGenerating}
              variant="outline"
              className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Generate New
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Program Info Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 px-4 py-2 text-sm font-semibold shadow-md rounded-full">
            <Calendar className="w-4 h-4 mr-2" />
            Week {currentProgram?.current_week || 1}
          </Badge>
          
          <Badge className="bg-gray-100 border-gray-200 text-gray-700 px-4 py-2 text-sm font-medium rounded-full">
            <Target className="w-4 h-4 mr-2" />
            {currentProgram?.difficulty_level || 'beginner'}
          </Badge>
          
          <Badge className="bg-green-100 border-green-200 text-green-700 px-4 py-2 text-sm font-medium rounded-full">
            {currentProgram?.program_name || 'Strength Training Program'}
          </Badge>
        </div>
      </div>
    </div>
  );
};

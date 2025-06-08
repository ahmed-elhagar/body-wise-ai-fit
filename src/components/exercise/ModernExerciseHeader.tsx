
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Dumbbell, Calendar, Target } from "lucide-react";
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
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 rounded-3xl border border-white/50 shadow-xl backdrop-blur-sm p-6">
        <div className="space-y-4">
          {/* Main Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left Section - Program Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Dumbbell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
                  Exercise Program
                </h1>
                <p className="text-gray-600 font-medium">
                  AI-Powered Personalized Fitness Journey
                </p>
              </div>
            </div>

            {/* Right Section - Action Button */}
            <div className="flex">
              <Button
                onClick={onShowAIDialog}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Customize Program
              </Button>
            </div>
          </div>

          {/* Program Info Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 px-4 py-2 text-sm font-semibold shadow-md rounded-full">
              <Calendar className="w-4 h-4 mr-2" />
              Week {currentProgram?.current_week || 1}
            </Badge>
            
            <Badge className="bg-white/80 border-gray-200 text-gray-700 px-4 py-2 text-sm font-medium rounded-full shadow-sm">
              <Target className="w-4 h-4 mr-2" />
              {currentProgram?.difficulty_level || 'beginner'}
            </Badge>
            
            <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-200 text-green-700 px-4 py-2 text-sm font-medium rounded-full shadow-sm">
              {currentProgram?.program_name || 'Strength Training Program'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

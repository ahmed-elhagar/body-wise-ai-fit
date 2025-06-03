
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Sparkles, Home, Building2, Target, Zap } from "lucide-react";
import { AIExerciseDialog } from "./AIExerciseDialog";

interface EmptyExerciseStateProps {
  onGenerateProgram: () => void;
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  aiPreferences: any;
  setAiPreferences: (prefs: any) => void;
  isGenerating: boolean;
}

export const EmptyExerciseState = ({ 
  onGenerateProgram, 
  workoutType,
  setWorkoutType,
  showAIDialog,
  setShowAIDialog,
  aiPreferences,
  setAiPreferences,
  isGenerating 
}: EmptyExerciseStateProps) => {
  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 border-0 shadow-xl backdrop-blur-sm">
            <div className="text-center max-w-2xl mx-auto">
              {/* Icon and Title */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Dumbbell className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                No Exercise Program Yet
              </h3>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Create your personalized AI-powered exercise program tailored to your fitness goals, schedule, and preferences.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Personalized Goals</h4>
                  <p className="text-sm text-gray-600">Customized for your fitness level and objectives</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Smart Scheduling</h4>
                  <p className="text-sm text-gray-600">Fits perfectly into your weekly routine</p>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={onGenerateProgram}
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {isGenerating ? 'Generating Your Program...' : 'Generate AI Exercise Program'}
              </Button>

              <p className="text-sm text-gray-500 mt-4">
                Takes less than 30 seconds to create your perfect workout plan
              </p>
            </div>
          </Card>
        </div>

        {/* Empty sidebar placeholder */}
        <div className="hidden xl:block xl:col-span-1">
          <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 border-0 shadow-lg backdrop-blur-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-gray-400" />
              </div>
              <h4 className="font-semibold text-gray-700 mb-2">Progress Tracking</h4>
              <p className="text-sm text-gray-500">
                Your workout progress and achievements will appear here once you start your program.
              </p>
            </div>
          </Card>
        </div>
      </div>

      <AIExerciseDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        preferences={aiPreferences}
        setPreferences={setAiPreferences}
        onGenerate={(prefs) => {
          // This will be handled by the parent component
          setShowAIDialog(false);
        }}
        isGenerating={isGenerating}
      />
    </>
  );
};


import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Sparkles, Target, Clock } from 'lucide-react';

interface EmptyProgramStateProps {
  onGenerateProgram: () => void;
  isGenerating: boolean;
}

const EmptyProgramState = ({ onGenerateProgram, isGenerating }: EmptyProgramStateProps) => {
  return (
    <Card className="p-8">
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-fitness-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Dumbbell className="w-8 h-8 text-fitness-primary-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          No Exercise Program Found
        </h3>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Create your personalized AI-powered exercise program tailored to your fitness goals and preferences.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Target className="w-5 h-5 text-fitness-primary-600" />
            <span className="text-sm text-gray-700">Goal-focused workouts</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-fitness-primary-600" />
            <span className="text-sm text-gray-700">Flexible scheduling</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Sparkles className="w-5 h-5 text-fitness-primary-600" />
            <span className="text-sm text-gray-700">AI-optimized</span>
          </div>
        </div>

        <Button 
          onClick={onGenerateProgram}
          disabled={isGenerating}
          className="bg-fitness-primary-500 hover:bg-fitness-primary-600 text-white px-8 py-3 text-base"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Generating Program...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Program
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default EmptyProgramState;
